# Import necessary modules
from linkedin_scraper import Person, actions
from selenium import webdriver

# Initialize the Chrome driver
driver = webdriver.Chrome()

# Provide your LinkedIn login credentials
email = "your_email@example.com"
password = "your_password"

# Log in to LinkedIn
actions.login(driver, email, password)

# URL of the LinkedIn profile to scrape
linkedin_profile_url = "https://www.linkedin.com/in/andre-iguodala-65b48ab5"

# Create a Person object for the given profile
person = Person(linkedin_profile_url, driver=driver)

# Access and print the scraped data
print("Name:", person.name)
print("About:", person.about)
print("\nExperiences:")
for experience in person.experiences:
    print("\tCompany:", experience.company)
    print("\tPosition:", experience.position)
    print("\tDate Range:", experience.date_range)
    print("\tLocation:", experience.location)
    print("\tDescription:", experience.description)
    print()

print("Educations:")
for education in person.educations:
    print("\tSchool:", education.school)
    print("\tDegree:", education.degree)
    print("\tField of Study:", education.field_of_study)
    print("\tDate Range:", education.date_range)
    print()

print("Interests:")
for interest in person.interests:
    print("\t", interest)

print("\nAccomplishments:")
for accomplishment in person.accomplishments:
    print("\t", accomplishment)

print("\nCurrent Company:", person.company)
print("Current Job Title:", person.job_title)

# Close the driver
driver.quit()

