## LightWave Employee Server Alexa Skill
v2.0 - 03DEC2018

The LightWave Employee Server Alexa Skill demonstrates how to integrate an Alexa Skill with the
employee Pathway server using LightWave Server. The skill is publicly available from [The Alexa Skills Store](https://www.amazon.com/gp/product/B077Y17L9T?ie=UTF8&ref-suffix=ss_rw).

The sample skill consists of two files:

* interaction-model.json - A JSON file containing the voice interaction model for the skill.
* index.js - A Javascript file containing the AWS Lambda function used by the skill.

**NOTE:** This sample illustrates how to integrate an Alexa Skill with LightWave Server using only
basic Javascript. It is not an example of how to build an advanced Alexa Skill, which might include
additional Javascript frameworks or Amazon SDKs, or be implemented in another programming language entirely.
For more information on developing advanced Alexa Skills, including documentation, samples, and best practices,
visit the [Alexa Skills Kit](https://developer.amazon.com/alexa-skills-kit) web site.

### Installing the Skill

If you would like to experiment with the skill, you may install it in your own Amazon account. Before
proceeding, we recommend you review the Amazon documentation [Create a Custom Skill for Alexa](https://developer.amazon.com/docs/quick-reference/custom-skill-quick-reference.html). The general steps
required to install the skill are:

- Sign into the Amazon Developer Console. Create a new account if necessary.
- Sign into the Amazon Web Services (AWS) Console. Create a new account if necessary. You will need access to the AWS Lambda service.
- In the Developer Console, create the Alexa Skill.
- In the AWS Console, create the AWS Lambda function.
- In the AWS Console, configure the Lambda function with the Alexa Skills Kit trigger.
- In the Developer Console, configure the endpoint for the skill using the ARN of the Lambda function.

You can install the skill in your account using the procedure outlined in the Alexa Skills Kit documentation,
[Steps to Build a Custom Skill](https://developer.amazon.com/docs/custom-skills/steps-to-build-a-custom-skill.html).
Variations from the standard procedure are outlined below:

**Step 1: Design a Voice User Interface** - Since the voice user interface is provided by the
sample, this step is not necessary.

**Step 3: Use the Voice Design to Build Your Interaction Model** - The voice interaction model is
provided in the file *interaction-model.json*. To install the interaction model in the Developer Console,
select **JSON Editor** from the Console menu and drag the *interaction-model.json* file onto the
**Drag and drop a .json file** target in the editor. This will create the required intents and slots
for the skill. Note that you may want to change the Skill Invocation Name to something more
suitable for your testing, especially if you already have the public version of the skill installed.
You can change the Skill Invocation Name by selecting **Invocation** from the Console menu.

**Step 4: Write and Test the Code for your Skill** - The skill uses an AWS Lambda function with the
code provided in file *index.js*. When creating the Lambda function, select *Author from scratch*
and use the Node.js runtime. When the function has been created, paste the contents of the
*index.js* file into the Lambda function editor.

Once you have completed the Steps 1 - 4, review the **Skill builder checklist** in the
Developer Console. If items 1 - 4 are green, you should be able to test the skill using the
the skill test page in the Console or any Alexa device associated with the account used to
login to the Console.

