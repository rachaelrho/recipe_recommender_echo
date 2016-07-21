## Personalized Nutrition-Based Recipe Recommender with Amazon Echo 

A project that takes a user's nutritional needs, food preferences and specific ingredients (currently 3-ingredient-combintation) and recommends a recipe. The user input and recommended output is transmitted via the Amazon Echo / Alexa voice service. In this repo you will find:

* `foodBlogs/`: recipe webscraping, python scripts and json output using Scrapy <br />
* `ingredient_feature_extraction.ipynb`: jupyter notebook to extract ingredient features from scraped recipes <br />
* `ingredient_similarity_recommendation.ipynb`: jupyter notebook to determine similar recipes based on ingredient input <br />
* `echo_ingredient_recipe/`: Alexa Skills template with intent schema, speech assets and recommend recipes in node.js (requires additional AWS Lambda function) <br />

