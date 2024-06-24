# Time and Space Complexity Analyzer Extension

![Time and Space Complexity Analyzer](./images/space-time-image.png)

## Overview

The Time and Space Complexity Analyzer extension is a powerful tool designed to help you analyze the time and space complexity of your code. As a user, all you need to do is select the code snippet you want to analyze and click on the extension icon. The tool will then start analyzing the selected code and display the time and space complexities visually on a graph. This extension is ideal for students, coders, and professionals looking to understand and optimize their code's performance.

## Features

- **Code Analysis:** Analyze the time and space complexity of selected code snippets.
- **Visual Graphs:** Display the analysis results visually on a graph.
- **Broad Compatibility:** Works seamlessly across all coding platforms, including LeetCode, GeeksforGeeks, HackerRank, HackerEarth, Codeforces, GitHub, and more.

## Setup Instructions

### Prerequisites

1. Ensure you have Node.js and npm installed on your system.
2. Clone the repository to your local machine.

### Steps

1. **Clone the Repository**

   ```
   git clone https://github.com/Siddartha-Kodaboina/Time-and-Space-Complexity-Extension---Local.git
   ```

2. **Get a Gemini API Key**

Visit Google Gemini API Documentation (https://ai.google.dev/gemini-api/docs/api-key) and follow the instructions to obtain a Gemini API key.

3. **Create a .env File**

In the root directory of the cloned repository, create a .env file and add your API key:

```
API_KEY="your-gemini-api-key"
```

4. **Pack the Extension**

Navigate to the root directory of the extension and run the following command to pack the extension:

```
npx webpack --mode development
```

5. **Load the Extension in Chrome**

- Open Chrome and go to the Extensions page: chrome://extensions/
- Enable "Developer mode" by toggling the switch in the upper-right corner.
- Click on "Load unpacked" and select the directory where you cloned the repository.

6. **Using the Extension**

- Visit any coding platform or webpage with code snippets.
- Select the code you want to analyze.
- Click on the extension icon in the Chrome toolbar.
- The extension will analyze the selected code and display the time and space complexities visually on a graph.

7. **Demo**

For a detailed demonstration on how to use the extension, please visit [Video_URL].

8. **Contributing**

We welcome contributions to enhance the functionality and features of this extension. If you have any suggestions or improvements, please open an issue or submit a pull request.

9. **License**

This project is licensed under the MIT License.

