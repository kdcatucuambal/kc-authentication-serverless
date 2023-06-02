import json
import sys

command = str(sys.argv[1])

sam_deploy = ''
sam_deploy_parameters = ''
sam_package = ''

with open('.stack/config.json') as f:
    data = json.load(f)
if command == "deploy":
    general_parameters = data['pipeline']['deploy']['parameters']
    deploy = data['pipeline']['deploy']
    sam_deploy += "--stack-name " + deploy['stack-name'] + " --s3-bucket " + deploy['s3-bucket'] + " --s3-prefix " + deploy['prefix'] + " --region " + \
        deploy['aws-default-region'] + " --capabilities " + deploy['capabilities'] + \
        " --no-confirm-changeset " + deploy['non-confirm-change-set'] + " "
    for parameter in general_parameters:
        sam_deploy_parameters += '{0}="{1}" '.format(
            parameter['parameterKey'], parameter['parameterValue'])
    print(sam_deploy + " --parameter-overrides " + sam_deploy_parameters, end='')

if command == "package":
    deploy = data['pipeline']['deploy']
    sam_package += " --s3-bucket " + deploy['s3-bucket'] + " --s3-prefix " + \
        deploy['prefix'] + " --region " + deploy['aws-default-region'] + " "
    print(sam_package, end='')
