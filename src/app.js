const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateProjectId(request, response, next) {
  const { id } = request.params

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repositorie ID.'})
  }

  return next()
}

app.use('/repositories/:id', validateProjectId)


app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, likes, url, techs } = request.body

  const repositorie = { id: uuid(), likes: 0, techs, title, url}

  repositories.push(repositorie)

  return response.status(201).json(repositorie)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  let { title, url, techs, likes } = request.body

  const repositorieIndex = repositories.findIndex(callback => callback.id === id)

  if (repositorieIndex < 0) {
    return response.status(400).json({ erro: "Repositorie not found."})
  }
  
  if (likes != repositories[repositorieIndex].likes) {
    likes = repositories[repositorieIndex].likes
  }

  const repositorie = {
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[repositorieIndex] = repositorie

  return response.json(repositorie)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositorieIndex = repositories.findIndex(callback => callback.id === id)

  if (repositorieIndex <0 ) {
    return response.status(400).json({ error: 'Repositorie not found.'})
  }

  repositories.splice(repositorieIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repositorieIndex = repositories.findIndex(callback => callback.id === id)

  if (repositorieIndex <0 ) {
    return response.status(400).json({ error: 'Repositorie not found.'})
  }
  
  repositories[repositorieIndex].likes ++

  return response.status(201).json({ likes: repositories[repositorieIndex].likes })
});

module.exports = app;
