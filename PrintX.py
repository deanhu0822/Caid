import streamlit as st
from openai import OpenAI
import subprocess
import uuid
import subprocess
import tempfile
import os
from stpyvista import stpyvista
import pyvista as pv
import threading
import streamlit.components.v1 as components
import base64
import trimesh





client = OpenAI(api_key="PUT YOUR KEY HERE")








st.set_page_config(layout="wide")
def file_to_base64_string(file_path):
    """
    Converts a file to a Base64 encoded string.

    Args:
    - file_path (str): The path to the file to encode.

    Returns:
    - str: The Base64 encoded string of the file's contents.
    """
    with open(file_path, 'rb') as file:
        encoded_string = base64.b64encode(file.read()).decode('utf-8')
    return encoded_string

userInput = st.text_input(label= "Enter your prompt here")

def render_stl_with_pyvista(stl_file_path: str) -> pv.Plotter:
    # Initialize a plotter object
    plotter = pv.Plotter(window_size=[400, 400])

    # Load the mesh from the STL file
    mesh = pv.read(stl_file_path)

    # Add the mesh to the plotter without specifying scalars to use the default color
    plotter.add_mesh(mesh, show_edges=True, edge_color="black")

    # Final touches
    plotter.background_color = "white"
    plotter.view_isometric()

    return plotter


def convert_openscad_code_to_stl(code_str, output_filename, format):
    # Ensure the output path is in the current working directory
    output_path = os.path.join(os.getcwd(), output_filename)
    
    # Create a temporary file to hold the OpenSCAD code, in the current working directory
    with tempfile.NamedTemporaryFile(delete=False, suffix='.scad', mode='w', dir=os.getcwd()) as tmp_file:
        tmp_file_name = tmp_file.name
        # Write the OpenSCAD code to the temporary file
        tmp_file.write(code_str)
    
    # Construct the OpenSCAD command
    # Note: Replace 'openscad' with the full path to the OpenSCAD executable if it's not in your system's PATH
    command = ['openscad', '-o', output_path, '--export-format', format, tmp_file_name]
    
    # Execute the command
    try:
        subprocess.run(command, check=True)
        print(f"Conversion successful. File saved to: {output_path}")
    except subprocess.CalledProcessError as e:
        print(f"Error during conversion: {e}")
    finally:
        # Clean up by deleting the temporary file
        os.remove(tmp_file_name)


def stl_to_glb(stl_file_path, glb_file_path):
    """
    Converts an STL file to a GLB file.

    Args:
    - stl_file_path (str): Path to the source STL file.
    - glb_file_path (str): Path where the resulting GLB file will be saved.
    """
    # Load the STL file
    mesh = trimesh.load(stl_file_path)
    
    # Export the loaded mesh as a GLB file
    mesh.export(glb_file_path, file_type='glb')



def query_gpt4(prompt):

    response = client.chat.completions.create(model="gpt-4",
    messages=[
          {"role": "system", "content": "You are a professional in OPENSCAD and create openscad code for people's prototypes"},
          {"role": "user", "content": prompt}
      ])

    # Extract the assistant's response
    return response.choices[0].message.content.strip()

def main():
    if st.button("Submit"):
        openScadCode = query_gpt4("Generate the OPENSCAD code for the following idea, only return your openscad code and nothing else whatsoever" + str(userInput))
        fileName = str(uuid.uuid4()) 
        filenameStl = fileName + ".stl"
        convert_openscad_code_to_stl(openScadCode, filenameStl, "stl")
        stl_to_glb(filenameStl, fileName + ".glb")
        #stpyvista(render_stl_with_pyvista(fileName))
    
        glb_base64 = file_to_base64_string(fileName + ".glb")
        webp_base64 = file_to_base64_string('board.webp')

        components.html(html=f'''
    

        <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"></script>
        <model-viewer style="width: 1000; height: 1000;" src="data:model/gltf-binary;base64,{glb_base64}" poster="data:image/webp;base64,{webp_base64}" tone-mapping="commerce" shadow-intensity="2" ar camera-controls touch-action="pan-y" alt="3D Render" skybox-image="https://upload.wikimedia.org/wikipedia/commons/1/18/Sunset_hdr.jpg"></model-viewer>
    ''', height=1000, width=1000)

        

main()


