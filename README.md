# Hands-On Labs Take-Home Assignment
<p align="center">
  <img src="https://i.ibb.co/4fFtLzC/featured.jpg" width="650">
</p>
This project serves as a foundation for an interactive platform aimed at providing a practical learning experience in robotics. It offers a fully functional 3D simulator of a robot arm, coupled with a block programming interface that enables students to learn coding while controlling the robotic arm's movements.

Key Features:

- Robotic Arm Simulator: Experience the virtual environment where you can manipulate a robot arm and observe its movements.
- Block Programming Interface: Learn to code through a user-friendly interface that allows you to drag and drop blocks of code to control the robot arm's behavior.
- Mock Live Stream: Get a glimpse of a real-life robot in action through a simulated live stream, providing an immersive experience of controlling a physical robot.
- Web Technologies: The platform is built using HTML and CSS for the frontend, while the authentication system and navigation are handled by Flask, a Python web framework.
- 3D Model and Programming: The 3D model and block programming interface are implemented using JavaScript, enabling interactive and dynamic user interactions.
- IoT Communication: Although the IoT communication is presented as a demonstration, the platform showcases the potential integration with IoT devices. The platform utilizes the Google Cloud IoT client to compile and send commands. When an IoT device is available, you can register it on the Google Cloud IoT Core and set up a message receiver. By translating these commands to GPIO pins, you can control the movements of a physical robot (note: code for receiving and controlling the robot is not included in this repository as it requires a physical device).

## Web Application:
```bash
#make sure you run the following commands in the folder Simulator
$ cd simulator
```
### Run Virtual Environment

Virtual environment is a key component in ensuring that the application is configured in the right environment

##### Requirements
* Python 3
* Pip 3

```bash
$ brew install python3
```

Pip3 is installed with Python3

##### Installation
To install virtualenv via pip run:
```bash
$ pip3 install virtualenv
```

##### Usage
Creation of virtualenv:

    $ virtualenv -p python3 venv

If the above code does not work, you could also do

    $ python3 -m venv venv

To activate the virtualenv:

    $ source venv/bin/activate

Or, if you are **using Windows** - [reference source:](https://stackoverflow.com/questions/8921188/issue-with-virtualenv-cannot-activate)

    $ venv\Scripts\activate

To deactivate the virtualenv (after you finished working):

    $ deactivate

Install dependencies in virtual environment:

    $ pip3 install -r requirements.txt


##### Run Application

Start the server by running:

    $ export FLASK_ENV=development
    $ export FLASK_APP=main
    $ python3 -m flask run
