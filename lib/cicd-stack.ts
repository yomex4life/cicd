import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CreateSthree } from './create-sthree';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CicdStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const s3bucket = new CreateSthree(this, 'MySthree');
  }
}
