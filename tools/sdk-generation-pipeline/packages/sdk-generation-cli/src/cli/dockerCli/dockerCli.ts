#!/usr/bin/env node
import { DockerContext } from "./core/DockerContext";
import { GenerateCodesInLocalJob } from './core/GenerateCodesInLocalJob';
import { GenerateCodesInPipelineJob } from "./core/GenerateCodesInPipelineJob";
import { GrowUpJob } from "./core/GrowUpJob";
import { DockerCliInput, dockerCliInput } from "./schema/dockerCliInput";

async function main() {
    const inputParams: DockerCliInput = dockerCliInput.getProperties();
    const context: DockerContext = new DockerContext();
    context.initialize(inputParams);

    let executeJob: GenerateCodesInLocalJob | GrowUpJob | GenerateCodesInPipelineJob;

    switch (context.mode) {
        case "generateCodesInLocal":
            executeJob = new GenerateCodesInLocalJob(context);
            break;
        case "growUp":
            executeJob = new GrowUpJob(context);
            break;
        case "generateCodesInPipeline":
            executeJob = new GenerateCodesInPipelineJob(context);
            break;
    }

    if (!!executeJob) {
        await executeJob.execute();
    }

}

main().catch(e => {
    console.error("\x1b[31m", e.toString());
    console.error("\x1b[31m", e.message);
    console.error("\x1b[31m", e.stack);
    process.exit(1);
})