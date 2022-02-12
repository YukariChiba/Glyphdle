<template>
  <div class="py-6 kb-bg">
    <div ref="svgdiv">
      <svg
        ref="svg"
        class="kb glyphpad"
        x="0"
        y="0"
        width="300"
        height="300"
        viewBox="0 0 400 400"
        @mousedown="startTracing"
        @mouseup="endTracing"
        @mousemove="traceMovement"
        @touchstart="startTracing"
        @touchend="endTracing"
        @touchmove="traceMovement"
      >
        <defs>
          <filter id="blur">
            <feGaussianBlur stdDeviation="1" />
          </filter>
        </defs>
      </svg>
    </div>
  </div>
</template>

<script>
import glyphtionary from "@/data/GlyphDots.json";

export default {
  data: () => ({
    height: 200,
    width: 200,
    tracing: false,
    circlesPosition: {},
    currentPolyline: null,
    currentTrace: "",
    lastHoverCircle: null,
    foundStrokes: [],
    compiledGlyphtionary: {},
    glyphtionary: glyphtionary,
  }),
  methods: {
    endTracing: function () {
      var evaluation = this.evaluateStrokes(this.foundStrokes);
      if (evaluation) {
        this.$emit("inputGlyph", evaluation.toUpperCase());
      }
      this.tracing = false;
      this.currentTrace = "";
      this.currentPolyline = null;
      this.lastHoverCircle = null;
      this.foundStrokes = [];
      this.removeElementsByClassName("glyphpad-trace");
      this.removeElementsByClassName("glyphpad-stroke");
      this.resetCircles();
      //unblockScreenScroll();
    },
    startTracing: function (e) {
      this.tracing = true;
      //blockScreenScroll();
      var circles = this.$refs.svg.getElementsByTagName("circle");
      for (var i = 0; i < circles.length; i++) {
        this.circlesPosition[circles[i].getAttribute("data-name")] = [
          parseFloat(circles[i].getAttribute("cx")),
          parseFloat(circles[i].getAttribute("cy")),
          parseFloat(circles[i].getAttribute("r")),
        ];
      }
      this.traceMovement(e);
    },
    removeElementsByClassName: function (className) {
      for (var j = 0; j < 5; j++) {
        var els = this.$refs.svg.getElementsByClassName(className);
        for (var i = 0; i < els.length; i++) {
          this.$refs.svg.removeChild(els[i]);
        }
      }
    },
    resetCircles: function () {
      var circles = this.$refs.svg.getElementsByTagName("circle");
      for (var i = 0; i < circles.length; i++) {
        circles[i].setAttribute("class", "glyphpad-circle");
      }
    },
    evaluateStrokes: function (strokes) {
      strokes.sort();
      var index = strokes.join("-");
      console.log("Evaluate:", index);
      if (this.compiledGlyphtionary[index]) {
        return this.compiledGlyphtionary[index];
      }
      return null;
    },
    pushPolyline: function (x, y) {
      if (!this.currentPolyline || this.currentTrace.length > 100) {
        this.currentPolyline = this.svgEl("polyline", {
          class: "glyphpad-trace",
        });
        this.currentTrace = "";
        this.$refs.svg.appendChild(this.currentPolyline);
      }
      this.currentTrace += " " + x.toString() + "," + y.toString();
      this.currentPolyline.setAttribute("points", this.currentTrace);
    },

    traceMovement: function (eventData) {
      let eX = 0,
        eY = 0;
      if (!("touches" in eventData)) {
        console.log("unknown");
        let o = this.recursiveOffsetLeftAndTop(this.$refs.svgdiv);
        eX = eventData.clientX - o.offsetLeft;
        eY = eventData.clientY - o.offsetTop;
      } else {
        console.log("touch");
        let o = this.recursiveOffsetLeftAndTop(this.$refs.svgdiv);
        eX = eventData.touches[0].clientX - o.offsetLeft;
        eY = eventData.touches[0].clientY - o.offsetTop;
      }
      if (!this.tracing) return;
      this.pushPolyline(eX, eY);
      // find if a circle is entered
      for (var label in this.circlesPosition) {
        if (
          Math.pow(eX - this.circlesPosition[label][0], 2) +
            Math.pow(eY - this.circlesPosition[label][1], 2) <=
          Math.pow(this.circlesPosition[label][2] * 2, 2)
        ) {
          this.onGlyphCircleHovered(null, label);
          break;
        }
      }
    },
    onGlyphCircleHovered: function (e, name) {
      if (!this.tracing) return;
      var el = this.$refs.svg.getElementById("glyphpad-circle-" + name);
      this.addClass(el, "glyphpad-circle-active");
      if (!this.lastHoverCircle) {
        this.lastHoverCircle = name;
        return;
      }
      if (name != this.lastHoverCircle) {
        this.pushStroke(name, this.lastHoverCircle);
        this.lastHoverCircle = name;
      }
    },
    pushStroke: function (a, b) {
      var stroke = [a, b],
        s;
      stroke.sort();
      s = stroke.join("");
      if (this.foundStrokes.indexOf(s) < 0) {
        this.foundStrokes.push(s);
        this.drawStroke(a, b);
      }
    },
    drawStroke: function (a, b) {
      var circleA = this.$refs.svg.getElementById("glyphpad-circle-" + a),
        circleB = this.$refs.svg.getElementById("glyphpad-circle-" + b);
      this.$refs.svg.appendChild(
        this.svgEl("line", {
          x1: circleA.getAttribute("cx"),
          y1: circleA.getAttribute("cy"),
          x2: circleB.getAttribute("cx"),
          y2: circleB.getAttribute("cy"),
          class: "glyphpad-stroke",
        })
      );
    },
    fictionToRealCoord: function (r, theta) {
      var x = r * this.height * 0.45 * Math.cos(theta) + this.width / 2,
        y = this.height / 2 - r * this.height * 0.45 * Math.sin(theta);
      return [x, y];
    },
    svgEl: function (tagName, attributes) {
      var el = document.createElementNS("http://www.w3.org/2000/svg", tagName);
      if (attributes) {
        for (var k in attributes) el.setAttribute(k, attributes[k]);
      }
      return el;
    },
    addClass: function (target, className) {
      var clsstr = target.getAttribute("class") || "";
      if (clsstr.indexOf(className) < 0) {
        target.setAttribute("class", clsstr + " " + className);
      }
    },
    drawCircle: function (r, theta, label) {
      var coord = this.fictionToRealCoord(r, theta);
      var x = coord[0],
        y = coord[1];
      var circle = this.svgEl("circle", {
        cx: x,
        cy: y,
        r: this.height * 0.03, //0.025,
        class: "glyphpad-circle",
        "data-name": label,
        id: "glyphpad-circle-" + label,
      });

      this.$refs.svg.appendChild(circle);
      return circle;
    },
    recursiveOffsetLeftAndTop: function (element) {
      var offsetLeft = 0;
      var offsetTop = 0;
      while (element) {
        offsetLeft += element.offsetLeft;
        offsetTop += element.offsetTop;
        element = element.offsetParent;
      }
      return {
        offsetLeft: offsetLeft,
        offsetTop: offsetTop,
      };
    },
  },
  mounted() {
    this.height = this.$refs.svg.viewBox.baseVal.height;
    this.width = this.$refs.svg.viewBox.baseVal.width;

    this.$refs.svg.setAttribute("width", this.width);
    this.$refs.svg.setAttribute("height", this.height);

    var SIX_DEGREES = Math.PI / 3;
    this.drawCircle(0, 0, "X");
    this.drawCircle(0.5, SIX_DEGREES * 0.5, "A");
    this.drawCircle(0.5, SIX_DEGREES * 2.5, "B");
    this.drawCircle(0.5, SIX_DEGREES * 3.5, "C");
    this.drawCircle(0.5, SIX_DEGREES * 5.5, "D");
    this.drawCircle(1, SIX_DEGREES * 0.5, "1");
    this.drawCircle(1, SIX_DEGREES * 1.5, "2");
    this.drawCircle(1, SIX_DEGREES * 2.5, "3");
    this.drawCircle(1, SIX_DEGREES * 3.5, "4");
    this.drawCircle(1, SIX_DEGREES * 4.5, "5");
    this.drawCircle(1, SIX_DEGREES * 5.5, "6");

    for (var seq in glyphtionary) {
      var seq1 = seq.split("-");
      var seq2 = [];
      for (var i = 0; i < seq1.length; i++) {
        var seq3 = [seq1[i][0], seq1[i][1]];
        seq3.sort();
        seq2.push(seq3.join(""));
      }
      seq2.sort();
      this.compiledGlyphtionary[seq2.join("-")] = glyphtionary[seq];
    }
  },
};
</script>

<style lang="scss">
.kb {
  width: 100%;
}

.glyphpad {
  background: #000000;
  touch-action: none;
}
.glyphpad-circle {
  stroke: white;
  stroke-width: 1px;
}
.glyphpad-circle.glyphpad-circle-active {
  fill: #ffffff;
  stroke: #a64dff;
  stroke-width: 4;
  filter: url(#blur);
}
.glyphpad-trace {
  stroke-dasharray: 5, 5;
  stroke-width: 10;
  stroke: white;
  fill: none;
  filter: url(#blur);
}
.glyphpad-stroke {
  fill: none;
  stroke: #00ffff;
  stroke-width: 5;
}
</style>

<style lang="scss" scoped>
.kb-bg {
  background: #000000;
}
</style>
