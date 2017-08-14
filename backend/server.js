const express = require('express');
const bodyParser = require('body-parser');
let data = require('./jobs');

const app = express();

let initialJobs = data.jobs;
let addedJobs = [];

const getAllJobs = () => {
    return [...addedJobs, ...initialJobs];
};

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", 'Content-Type');
    next();
});

const api = express.Router();

api.get('/jobs', (req, res) => {
    res.json(getAllJobs());
});

api.post('/jobs', (req, res) => {
    const job = req.body;
    addedJobs = [job, ...addedJobs];
    console.log('total nb of jobs', getAllJobs().length);
    res.json(job);
});

api.get('/jobs/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const job = getAllJobs().filter(j => j.id === id);
    if(job.length === 1){
        res.json({ success: true, job: job[0]});
    } else {
        res.json({ success: false, message: `pas de job ayant pour id ${id}`});
    }
});

api.get('/search/:term/:place?', (req, res) => {
    const term = req.params.term.toLowerCase().trim();
    let place = req.params.place;
    let jobs = getAllJobs().filter(j => (j.description.toLowerCase().includes(term) || j.title.toLowerCase().includes(term) ));
    if(place) {
        place = place.toLowerCase().trim();
        jobs = jobs.filter(j => (j.city.toLowerCase().includes(place) ));
    }
    res.json({ success: true, jobs});
})

app.use('/api',api);  // localhost:3000/api/jobs

const port = 3000;

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});