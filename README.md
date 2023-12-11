# Patient Chart Online

# a. Add a brief description of your application in the README file.
This application allows a user to create up to 10 medical files "charts"; which would be used in a healthcare clinic or hospital.
The limit is set at 10 (you can't add more than 10 charts) to avoid healthcare worker overload, but can be changed within the code.
If not signed in, you cannot view any data other than billing reference number.
If you sign in, you can view, create, amend, and delete various patient's medical data.
You can view associated patient files from File button.
Provider portal, is for a demo of how health record coding, billing, and supplies can be combined in a single software application.
The point is to add information once, which can then be viewable to the entire healthcare team - rather than making multiple notes in different formats like fax, personal doctor email, which can be unreliable and is time consuming. An additional feature that could be added is to allow certain data viewing & transfer permissions to work with laws/company policy. Other features that can be added are data aggregation from multiple patients with the same ICD code (morbidity) and their progress to find the best plan of care (treatments). 

# b. Include a link to your live site in the README file.
https://patientchartonline.azurewebsites.net

# c. Add a brief description of the Additional Feature you implemented in theREADME file.
Package installed: npm install multer    
multer allows for file upload 
Source: https://www.npmjs.com/package/multer
Press File button. Upload or view files. 
Files are uploaded locally to a folder with the same id as the created chart (completed add a new chart form) from chart.js model and chart.js route.
The user can upload various file formats, such as pdf, jpg, and docx.
These files can be viewed in their respective chart (row), they are not mixed with other rows. 
These files are used for communication and as an information reference for healthcare providers; they can easily be shared via email to other healthcare centers (ie. progress pictures).
When chart is deleted (patient has been discharged), the associated folder is also deleted.

//ChatGPT used to: 
1. generate an example of file uploading (app.js #4), which was expanded upon by myself to allow for files to only be added to there respective folders. I also figured out how to view the uploaded file by extracting the chartId from the file name, then concatenating it to make a working file path.
2. generate fs.mkdir functions (chart.js) so that folders would be created and deleted when respective buttons were pressed
