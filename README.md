# ultima
- Built with angular and @ acrodata / gui, the flowchart can be configured with simple json and has high component scalability
## example
### Simple
```json
[
  {
    "id": "1",
    "name": "Test one",
    "description": "",
    "postion": { "x": 60, "y": 130 },
    "config": {
      "title": {
        "type": "text",
        "name": "Title",
        "placeholder": "Please enter a title"
      }
    }
  }
]
```
### associated
```json
[
  {
    "id": "1",
    "name": "Test one",
    "description": "",
    "postion": { "x": 60, "y": 130 },
    "config": {
      "title": {
        "type": "text",
        "name": "Title",
        "placeholder": "Please enter a title"
      }
    }
  },
  {
    "id": "2",
    "name": "Test two",
    "description": "",
    "anchorId": "1",
    "postion": { "x": 60, "y": 130 },
    "config": {
      "title": {
        "type": "text",
        "name": "Title",
        "placeholder": "Please enter a title"
      }
    }
  }
]
```
Supported form component reference [https://acrodata.github.io/gui/home]
