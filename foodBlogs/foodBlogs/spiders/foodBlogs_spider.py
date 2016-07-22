import scrapy
from scrapy_splash import SplashRequest
import urlparse

from foodBlogs.items import foodBlogsItem

helpCat = ["baked-goods","chia-pudding","hummus","dips-spreads-and-sauces","dressings","salads","smoothies","soups","entrees",
      "desserts","nut-milks","breads-crackers-and-wraps","small-plates-and-snacks"]

fitCat = ["breakfast-3","lunch-3","dinner-2","snacks-2","desserts"]

rootCat = ["appetizer","breakfast","dessert","drinks-smoothies","main-dishes","soup"]


class foodBlogs_spider(scrapy.Spider):
	name = "foodBlogs"
	allowed_domains = ["theroastedroot.net"] #"fitfoodiefinds.com" #["sweetpotatosoul.com","ohmyveggies.com","naturallyella.com","ohsheglows.com","ilovevegan.com","paleomg.com","minimalistbaker.com"] # naturallyElla, OSG and fullhelping only works without splash
	start_urls = ["http://www.theroastedroot.net/category/" + str(x) + "/page/" + str(y) for x in rootCat for y in range(1,12)] #["http://sweetpotatosoul.com/recipes","http://ohmyveggies.com/oh-my-veggies-recipe-index/] + ["http://naturallyella.com/recipes/?sf_paged=" + str(x) for x in range(1,27)] + ["http://www.thefullhelping.com/recipes/" + str(x) for x in helpCat] + ["http://ohsheglows.com/categories/recipes-2/page/" + str(z) for z in range(1,14)] + ["http://paleomg.com/category/food/page/" + str(x) for x in range(1,28)] + ["http://minimalistbaker.com/recipes/page/" + str(y) for y in range(1,38)]

## try this again later ["http://fitfoodiefinds.com/category/" + str(x) + "/page/" + str(y) for x in fitCat for y in range(1,14)] 


	#def start_requests(self):
		#for url in self.start_urls:
			#yield SplashRequest(url, self.parse, ##SplashRequest
				#args= {'wait': 60}, endpoint='render.html')

	def parse(self, response):
		for href in response.xpath("//a//@href"): 
			#try:
			url = response.urljoin(href.extract())
			yield scrapy.Request(url, callback=self.parse_dir_contents)

			#yield SplashRequest(url, callback=self.parse_dir_contents,
				#args= {'wait': 2}, endpoint='render.html')
			#except (RuntimeError, TypeError, NameError):
				#print 'error and will pass' 

	def parse_dir_contents(self, response):
		try:
			item = foodBlogsItem()
			item['url'] = response.url
			item['category'] = response.xpath('//*[contains(@itemprop, "recipeCategory")]/text()').extract()
			item['title'] = response.xpath('//*[contains(@class, "ERSName")]/text()').extract()
			item['summary'] = response.xpath('//*[contains(@class, "ERSSummary")]/text()').extract()
			item['ingredientsList'] = response.xpath('//*[contains(@class, "ingredient")]/text()').extract() 
			item['instructions'] = response.xpath('//*[contains(@class, "instruction")]/text()').extract()
			
			yield item

		except (RuntimeError, TypeError, NameError):
			print 'error and will pass'

		







