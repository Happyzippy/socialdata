# socialdata
A repository for The DTU course "Social data analysis and visualization 02806"

The repository consists of a folder per group member for group work, and one for each assignment
Data files can be placed in the **data** folder, but will not be uploaded to git as these tend to be very large.
If you want to add a data file add the file to the .gitignore folder as `!filename.xx`
If we name files properly, we will be able to run the scripts at all our computers

Github pages can be reached at http://happyzippy.github.io/socialdata

Don't commit directly to the gh-pages branch, this is mirrored from the master. This can be done automatically by adding
> push = +refs/heads/master:refs/heads/gh-pages  
> push = +refs/heads/master:refs/heads/master  

to your local `.git/config` file
