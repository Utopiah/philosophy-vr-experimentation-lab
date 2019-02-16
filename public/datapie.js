function generatePie(value1, value2){

  var pie = new d3pie("pieChart", {
    "header": {
      "title": {
        "text": "Trolley problem, our results",
        "fontSize": 24,
        "font": "open sans"
      },
      "subtitle": {
        "text": "Automatically generated from live data",
        "color": "#999999",
        "fontSize": 12,
        "font": "open sans"
      },
      "titleSubtitlePadding": 9
    },
    "footer": {
      "color": "#999999",
      "fontSize": 10,
      "font": "open sans",
      "location": "bottom-left"
    },
    "size": {
      "canvasWidth": 590,
      "pieOuterRadius": "90%"
    },
    "data": {
      "sortOrder": "value-desc",
      "content": [
        {
          "label": "Left",
          "value": value1,
          "color": "#2484c1"
        },
        {
          "label": "Right",
          "value": value2,
          "color": "#248838"
        }
      ]
    },
    "labels": {
      "outer": {
        "pieDistance": 32
      },
      "inner": {
        "hideWhenLessThanPercentage": 3
      },
      "mainLabel": {
        "fontSize": 11
      },
      "percentage": {
        "color": "#ffffff",
        "decimalPlaces": 0
      },
      "value": {
        "color": "#adadad",
        "fontSize": 11
      },
      "lines": {
        "enabled": true
      },
      "truncation": {
        "enabled": true
      }
    },
    "effects": {
      "pullOutSegmentOnClick": {
        "effect": "linear",
        "speed": 400,
        "size": 8
      }
    },
    "misc": {
      "gradient": {
        "enabled": true,
        "percentage": 100
      }
    }
  });

}