### Job Application tracker

This repository implements API for [job-application-tracker](https://github.com/energywraith/job-application-tracker) project.
Mentioned project is front end app written in React.

API is being implemented following monolithic architecture.
Hosted using express at: https://api.jobtracker.pl

NOTE: there is serverless implementation in the code (had no heart to remove it), because it was previously hosted on AWS Lambda, but since prisma is used, zipped app is too big.
Prisma webpack plugin doesn't help either, I guess the only way to make this work is using lambda layers, but I didn't feel like making it work,
so I just took free tier oracle vps and created auto deploy through github actions, works wonderfully!

Documentation:
[Postman](https://documenter.getpostman.com/view/9956320/UyrBhvHX)

The Problem

    Students apply for hundreds of jobs but can become disorganized.

    Input a company. Date of application.

    Add stages e.g. Stage 1: Phone screening. Stage 2: In-person interview.

    Status of application.

    Notes about each company. Maybe it can pull info from somewhere.
