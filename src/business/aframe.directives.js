import AFRAME from 'aframe';

AFRAME.registerComponent('listen-position', {
  tick() {
    console.log(this.el.getAttribute('position'));
  },
});
