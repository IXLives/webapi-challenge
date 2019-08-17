const express = require("express");

const db = require("../data/helpers/projectModel");

const router = express.Router();

// Get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await db.get();
    res.status(200).json(projects);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "The posts information could not be retrieved"
    });
  }
});

//Get project by ID
router.get("/:id", validateProjectId, async (req, res) => {
  try {
    const project = await db.get(req.params.id);

    res.status(200).json(project);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "The post information could not be retrieved"
    });
  }
});

//Get Project Actions
router.get("/:id/actions", validateProjectId, async (req, res) => {
    try {
        const actions = await db.getProjectActions(req.params.id)

        if(actions.length < 1) {
            res.status(300).json({
                message:"The project has no actions"
            })
        } else {
            res.status(201).json(actions)
        }
    } catch(error) {
        res.status(500).json({
            message: "The project's actions could not be retrieved"
        })
    }
})

//Add a project
router.post("/", validateProjectBody, async (req, res) => {
    try {
        const project = req.body

        if (project.name && project.description) {
            await db.insert(project)
            res.status(201).json(project)
        } else {
            res.status(400).json({
                message: "New projects require a Name and Description"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "There was an error while adding the Project to the database"
        })
    }
})

//Edit a project

//Delete a project

//Middlewarez

//Check if project id exists
function validateProjectId(req, res, next) {
    const { id } = req.params;

    db.get(id)
      .then(project => {
        if (project) {
          next();
        } else {
          res.status(404).json({ message: "No project with given id." });
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
function validateProjectBody(req, res, next) {
    if (req.body && Object.keys(req.body).length > 0) {
      next();
    } else {
      next({ message: "Bad request." });
    }
  }

//Export
module.exports = router;
