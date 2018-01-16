# Physics in Augmented Reality
## Quinn Ciccoretti, TJHSST

> Augmented reality gives the user the ability to add virtual objects to their own environment, which is advantageous when it would be too hard to obtain those objects in reality. The simulation of physics in augmented reality would give the user the additional ability to see not just how virtual objects would look in their environment, but how they would interact with that environment. This project attempts to shortcut the process of reading in the environment by letting the user define the areas of interaction, and will be implemented as a web application using the Oculus Rift and various sensors.

### Materials Needed
#### Hardware
- Oculus Rift, including position sensor
- Leap Motion hand sensor
### How to run:
(Try the live demo of master at https://vrscape.herokuapp.com)
1. Start a node server locally
   1. Ensure that node is installed properly with `node -v`
   2. Ensure that npm is installed properly with `npm -v`
   3. Run `npm install`
   4. Run `node serve.js`
2. Use a browser to navigate to [localhost:5000](localhost:5000)

## TO DO
- [ ] Now that the oculus is open to outside sources, try the sketchy 
plugin. Only afterward do you need to switch to reactvr
- [ ] Part of the reason you can't pick things up is because the key for 
enabling collisions is now used to adjust the camera. Branch needed.
- [x] Node works, so fix heroku. You probably need to app.listen
- [x] Stop fooling around with python simplehttp and convert everything to node. May have to re-init npm and install physijs etc.
- [ ] update everything to sh's for portability
- [ ] turn on the linux subsystem
- [ ] suppress errors for unbound textures
- [ ] Catch improperly formatted json data or figure out what causes it.
- [ ] Use the 360deg camera to get a nice video to put into threejs.
- [x] Stay woke