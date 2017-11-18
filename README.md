# ResProject
## Quinn Ciccoretti, TJHSST

> Augmented reality gives the user the ability to add virtual objects to their own environment, which is advantageous when it would be too hard to obtain those objects in reality. The simulation of physics in augmented reality would give the user the additional ability to see not just how virtual objects would look in their environment, but how they would interact with that environment. This project attempts to shortcut the process of reading in the environment by letting the user define the areas of interaction, and will be implemented as a web application using the Oculus Rift and various sensors.

### Materials Needed
#### Hardware
- Oculus Rift, including position sensor
- Leap Motion hand sensor
#### How to run:
1. Physijs requires worker threads to be hosted separately, so cd to the directory containing index.html and run 
`python -m http.server`
(python 3)
or
`python -m SimpleHTTPServer`
(python 2)
2. Use a browser to navigate to localhost:8000/index.html