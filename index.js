
class FunctionVersionParameter {
  
  constructor(serverless, options) {
    
    this.serverless = serverless;
    
    this.options = options;
    
    this.hooks = {
      'before:package:finalize': this.beforePackageFinalize.bind(this)
    };
    
  }
  
  beforePackageFinalize() {
    
    // console.log('beforePackageFinalize', this.serverless.service.functions);
    // console.log('beforePackageFinalize', this.serverless.service.provider.compiledCloudFormationTemplate.Resources);
    
    Object.keys(this.serverless.service.functions).forEach((fn) => {
      
      const resource = this.createFunctionVersionArnParameter(
        fn,
        this.serverless.service.functions[fn]
      );
      
      this.serverless.service.provider.compiledCloudFormationTemplate.Resources[`${this.capitalizeFirst(fn)}LambdaVersionArn`] = resource;
      
    });
    
  }
  
  capitalizeFirst(name) {
    
    return name.charAt(0).toUpperCase() + name.slice(1);
    
  }
  
  createFunctionVersionArnParameter(name, fn) {
    
    return {
      "Type": "AWS::SSM::Parameter",
      "Properties": {
        Name: {
          "Fn::Sub": "/${AWS::StackName}/"+name+"/LambdaVersionArn"
        },
        Type: "String",
        Value: {
          "Ref": fn.versionLogicalId
        }
      }
    };
    
  }
  
}

module.exports = FunctionVersionParameter;
