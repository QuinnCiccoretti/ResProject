# Physics in Virtual Reality
# This project is deprecated! Visit https://github.com/quinnciccoretti/physvr/ for the functioning project
## Quinn Ciccoretti, TJHSST
### Materials Needed
#### Hardware
- Oculus Rift, including position sensor
- Leap Motion hand sensor

#### Software
- [Leap Motion SDK](https://developer.leapmotion.com/get-started/)


### How to run:
(Try the live demo of master at https://vrscape.herokuapp.com)
1. Start a node server locally
   1. Ensure that node is installed properly with `node -v`
   2. Ensure that npm is installed properly with `npm -v`
   3. Run `npm install`
   4. Run `node serve.js`
2. Use a browser to navigate to http://localhost:5000

## TO DO
- [ ] As it turns out, vr.js has no SDK2 support so you will need to use webvr. Branch needed
- [ ] Part of the reason you can't pick things up is because the key for 
enabling collisions is now used to adjust the camera. Branch needed.
- [ ] update everything to sh's for portability
- [ ] suppress errors for unbound textures
- [ ] Catch improperly formatted json data or figure out what causes it.
- [ ] Use the 360deg camera to get a nice video to put into threejs. Maybe take pictures and stagger it a bit so it is almost augmented. Branch needed
- [x] Stay woke
