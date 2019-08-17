const express = require("express");

const db = require("../data/helpers/actionModel");
const projects = require("../data/helpers/projectModel");

const router = express.Router();

// Get all actions
router.get("/", async (req, res) => {
  try {
    const actions = await db.get();
    res.status(200).json(actions);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "The action's information could not be retrieved"
    });
  }
});

// Get actions by ID
router.get("/:id", validateActionId, async (req, res) => {
  try {
    const action = await db.get(req.params.id);

    res.status(200).json(action);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "The action information could not be retrieved"
    });
  }
});

//Add an action
router.post("/", [validateProjectId, validateActionBody], async (req, res) => {
  try {
    const action = req.body;
    if (action.notes && action.description && action.project_id) {
      await db.insert(action);
      res.status(201).json(action);
    } else {
      res.status(400).json({
        message: "New actions require a description, notes, and a project_id"
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "There was an error while adding the action to the database"
    });
  }
});

//Edit an action
router.put("/:id", [validateActionBody, validateActionId], async (req, res) => {
  try {
    const action = req.body;
    const id = req.params.id;
    if (action.notes && action.description) {
      await db.update(id, action);
      res.status(201).json(action);
    } else {
      res.status(400).json({
        message: "Notes and description required."
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "There was an error while editing the action"
    });
  }
});

//Delete an action
router.delete("/:id", validateActionId, async (req, res) => {
  try {
    const id = req.params.id;

    await db.remove(id);
    res.status(201).json({
      message: "Deleted"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "There was a problem deleting the action"
    });
  }
});

//Middlewarez
//Check if action id exists
function validateActionId(req, res, next) {
  const { id } = req.params;

  db.get(id)
    .then(project => {
      if (project) {
        next();
      } else {
        res.status(404).json({ message: "No action with given id." });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "Error processing request."
      });
    });
}

//Check post for valid body
function validateActionBody(req, res, next) {
  if (req.body && Object.keys(req.body).length > 0) {
    next();
  } else {
    next({ message: "Bad request." });
  }
}

//Check validity of Project ID
function validateProjectId(req, res, next) {
  const id = req.body.project_id;

  projects
    .get(id)
    .then(project => {
      if (project != null) {
        next();
      } else {
        res.status(404).json({
          message: "No such project exists"
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "Bad request"
      });
    });
}

module.exports = router;
