import API_KEY from './config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Chart from 'chart.js/auto';

document.addEventListener('DOMContentLoaded', async () => {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const selectedText = await getSelectedText();
  document.getElementById('loading-container').display = "block";
  document.getElementById('no-code').style.display = 'none';
  document.getElementById('graphs').style.display = 'none';

  const isCode = await checkIfCode(model, selectedText);
  console.log("selectedText is : \n", selectedText);
  if (isCode) {
    const complexity = await analyzeComplexity(model, selectedText);
    document.getElementById('loading-container').style.display = 'none';
    document.getElementById('no-code').style.display = 'none';
    document.getElementById('graphs').style.display = 'block';

    createComplexityChart('timeComplexityChart', `Time Complexity ${complexity.time}`, complexity.time);
    createComplexityChart('spaceComplexityChart', `Space Complexity ${complexity.space}`, complexity.space);
  } else {
    document.getElementById('loading-container').style.display = 'none';
    document.getElementById('no-code').style.display = 'block';
    document.getElementById('graphs').style.display = 'none';
  }
});

async function getSelectedText() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('selectedText', (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result.selectedText || 'No text selected.');
      }
    });
  });
}

async function checkIfCode(model, text) {
  const prompt = `Is the following text code? ${text}`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const responseText = await response.text();
  return responseText.includes('Yes');
}

async function analyzeComplexity(model, text) {
  const prompt = `
    Example1:
    CODE: 
    bool findElement(int arr[], int n, int key)
    {
        for (int i = 0; i < n; i++) {
            if (arr[i] == key) {
                return true;
            }
        }
        return false;
    }
    Time:O(N)|Space:(N)

    Example2:
    CODE: 
    int binarySearch(int arr[], int l, int r, int x)
    {
        if (r >= l) {
            int mid = l + (r - l) / 2;
            if (arr[mid] == x)
                return mid;
            if (arr[mid] > x)
                return binarySearch(arr, l, mid - 1, x);
            return binarySearch(arr, mid + 1, r, x);
        }
        return -1;
    }
    Time:O(log(N))|Space:(N)

    Example3:
    CODE: 
    void bubbleSort(int arr[], int n)
    {
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    swap(&arr[j], &arr[j + 1]);
                }
            }
        }
    }
    Time:O(N**2)|Space:(N)

    Example4:
    void iterateLoop(){
      for (int i = 1; i < n; i++) {
        i *= k;
      }
    }
    Time:O(log(N) base K)|Space:(1)

    Analyze the below code and provide the time complexity of the code just like above in the same format, please do not explain anything
    
    CODE: ${text}
    Time: O(<time-complexity>)|Space: O(<space-complexity>)`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const responseText = await response.text();

  // Extract time and space complexity from the response
  if (responseText.includes("Time") && responseText.includes("Space")) {
    const [time, space] = responseText.split('|').map(part => part.trim());
    const timeComplexity = time.slice(6).trim();
    const spaceComplexity = space.slice(7).trim();
    return { time: timeComplexity, space: spaceComplexity };
  }

  return {
    time: 'Unknown',
    space: 'Unknown'
  };
}

function createComplexityChart(canvasId, title, complexity) {
  const ctx = document.getElementById(canvasId).getContext('2d');

  // Define the range for N
  const N = Array.from({ length: 100 }, (_, i) => i + 1);

  // Define the functions for different time complexities
  const complexities = {
    'O(1)': N.map(() => 1),
    'O(log N)': N.map(n => Math.log2(n)),
    'O(N)': N.map(n => n),
    'O(N log N)': N.map(n => n * Math.log2(n)),
    'O(2**N)': N.map(n => Math.pow(2, n)),
    'O(N!)': N.map(n => {
      const fact = x => x <= 1 ? 1 : x * fact(x - 1);
      return Math.min(fact(n), 100);
    })
  };
  // if(complexity==)

  // Filter the data to remove points after Y reaches 100
  const filteredComplexities = {};
  Object.entries(complexities).forEach(([key, values]) => {
    let reachedLimit = false;
    filteredComplexities[key] = values.map((val, index) => {
      if (reachedLimit) return null;
      if (val >= 100) {
        reachedLimit = true;
        return 100;
      }
      return val;
    }).filter(val => val !== null);
  });

  // Prepare datasets
  const datasets = Object.entries(filteredComplexities).map(([key, values]) => ({
    label: key,
    data: values,
    borderColor: key === complexity ? 'rgba(217, 101, 112, 1)' : 'rgba(155, 114, 203, 1)',
    borderWidth: 2,
    fill: false,
    pointStyle: false
  }));

  // Chart configuration
  const config = {
    type: 'line',
    data: {
      labels: N.slice(0, Math.max(...Object.values(filteredComplexities).map(arr => arr.length))),
      datasets: datasets
    },
    options: {
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          max: 100
        },
        y: {
          beginAtZero: true,
          max: 100
        }
      },
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: title,
          font: {
            size: 18
          }
        }
      },
      elements: {
        point: {
          radius: 0 // This will hide the points
        }
      },
      responsive: true,
      maintainAspectRatio: false,
    }
  };

  new Chart(ctx, config);
}
