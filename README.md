## Caid

### Version 0

### Overview

My aim is to redefine the connection between digital and the physical world. 
Our MVP converts natural language into dimensionally accurate CAD models, enabling rapid prototyping for all.


https://github.com/user-attachments/assets/7144b335-44f3-4bd9-8956-65124c38e4d4


### Key Features

- **Text-to-CAD**: Provide simple, descriptive prompts, and let Caid handle the rest. Whether you’re an engineer, designer, or someone with a creative idea, Caid translates your words into detailed CAD models ready for manufacturing.
  
- **Rapid Iteration**: Caid allows for iterations, enabling you to refine your designs swiftly and efficiently. Spend less time on adjustments and more time on details and collective creativity.
  
- **User-Friendly Interface**: We believe in making complex technology accessible. Caid’s interface is designed to be intuitive, eliminating the need for specialized knowledge in CAD software.
  
- **Exportable Models**: Once you complete each design, you can easily export your CAD models in various formats compatible with your preferred manufacturing tools (STL,OBJ).

### Getting Started

**Step 1: Set Up Your Environment**

  > **Install Python**:
   - Download the latest version of Python from [python.org](https://www.python.org/downloads/).
   - During installation, ensure you check the box that says "Add Python to PATH". This will make Python accessible from your command line.

  > **Unzip PrintX.zip**:
   - Locate the `PrintX.zip` file on your computer.
   - Right-click on the file and select "Extract All" (Windows) or use a similar extraction method on your OS.
   - Extract the contents to a folder named `PrintX`.

**Step 2: Explore the Contents**

Once extracted, you should see the following items in the `PrintX` directory:

- **`PrintX.py`**: This is the main Python script that drives the core functionality of PrintX.
- **`venv/`**: This folder contains a virtual environment with all the necessary Python dependencies installed. Using this ensures that your project runs smoothly without interference from other projects or system-level packages.
- **`.DS_Store`**: A macOS-specific file that you can ignore.

**Step 3: Activate the Virtual Environment**

  > **Open your terminal**:
   - Use the command line interface of your operating system. On Windows, you can use Command Prompt or PowerShell; on macOS/Linux, use Terminal.

  > **Navigate to the Project Folder**:
   - Change your directory to the `PrintX` folder using the `cd` command:
     ```bash
     cd path_to_PrintX_folder
     ```
   - Replace `path_to_PrintX_folder` with the actual path where you extracted the files.

  > **Activate the Virtual Environment**:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
   - After activation, you should see the virtual environment's name in your terminal prompt, indicating it's active.

**Step 4: Run the Script**

  > **Execute `PrintX.py`**:
     - With the virtual environment activated, run the main script:
     ```bash
     python PrintX.py
     ```
     - The script will execute, and you should see the output directly in your terminal.

  > **Observe and Follow the Instructions**:
     - The script might prompt you for inputs or display outputs. Follow the instructions as they appear.

**Step 5: Customize and Experiment**

  > **Modify `PrintX.py`**:
     - Open `PrintX.py` in a text editor like Visual Studio Code, Notepad++, or any editor you prefer.
     - Try making small changes to the code, such as modifying print statements or adjusting variables.

  > **Rerun the Script**:
     - After making changes, rerun the script using the same command:
     ```bash
     python PrintX.py
     ```

### Contributions

As this is the initial version of Caid, we welcome feedback, suggestions, and contributions.

### Support

If you need help or have any questions, please reach out!
