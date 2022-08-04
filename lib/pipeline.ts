import { Construct } from "constructs";
import { Pipeline, Artifact } from "aws-cdk-lib/aws-codepipeline";
import { GitHubSourceAction, CodeBuildAction, CloudFormationCreateUpdateStackAction } from "aws-cdk-lib/aws-codepipeline-actions";
import { SecretValue, Stack, StackProps } from "aws-cdk-lib";
import { PipelineProject, LinuxBuildImage, BuildSpec } from "aws-cdk-lib/aws-codebuild";// import * as sqs from 'aws-cdk-lib/aws-sqs';


export class cicdPipeline extends Stack{
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
    
    
        const pipeline = new Pipeline(this, 'Pipeline', {
            pipelineName: 'pipeline',
            crossAccountKeys: false
        });

        const sourceOutput = new Artifact('SourceOutput');


        pipeline.addStage({
            stageName: 'Source',
            actions: [
                new GitHubSourceAction({
                  owner: 'yomex4life',
                  repo: 'cicd',
                  branch: 'main',
                  actionName: 'Pipeline_Source',
                  oauthToken: SecretValue.secretsManager('github-token'),
                  output: sourceOutput
                })
              ]
        })

        const cdkBuildOutput = new Artifact('cdkBuildOutput');

        pipeline.addStage({
            stageName: "Build",
            actions: [new CodeBuildAction({
            actionName: "CDK_build",
            input: sourceOutput,
            outputs: [cdkBuildOutput],
            project: new PipelineProject(this, 'CdkBuildProject', {
                environment: {
                buildImage: LinuxBuildImage.STANDARD_6_0
                },
                buildSpec:BuildSpec.fromSourceFilename('build-specs/cdk-build-spec.yml')
            })
            })]
        });

        pipeline.addStage({
            stageName: 'Pipeline_Update',
            actions: [
                new CloudFormationCreateUpdateStackAction({
                    actionName: 'Pipeline_Update',
                    stackName: 'PipelineStack',
                    templatePath: cdkBuildOutput.atPath('PipelineStack.template.json'),
                    adminPermissions: true
                })
            ]
        })
    }
}