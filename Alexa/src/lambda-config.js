module.exports = {
  profile: 'default',
  region: 'us-east-1',
  handler: 'index.handler',
  role: 'arn:aws:iam::849705966876:role/service-role/AlexaSkillsRole',
  functionName: 'EmployeeServerAlexaSkills',
  description: 'Alexa Skills for Employee Server via LightWave',
  timeout: 10,
  memorySize: 128,
  publish: true,
  runtime: 'nodejs4.3'
  /*,
  eventSource: {
    EventSourceArn: 'amzn1.ask.skill.2980c791-0d97-4dcc-b981-fa0317c5e66e',
    BatchSize: 200,
    StartingPosition: "TRIM_HORIZON"
  }*/
}