using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyRecipes.Models
{
    public static class SeedData
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new MyRecipesContext(
                serviceProvider.GetRequiredService<DbContextOptions<MyRecipesContext>>()))
            {
                // Look for any movies.
                if (context.Recipe.Count() > 0)
                {
                    return;   // DB has been seeded
                }

                context.Recipe.AddRange(
                    new Recipe
                    {
                   
                           Name= "Classic Cheesecake with Blueberries",
                           Url= "https://example.com/url-to-meme-img.jpg",
                           Author= "Admin",
                           Tags= "Western Dessert",
                           Uploaded= "20/11/2018 10:09:52 PM",
                           Overview= "Nice and smooth cheesecake that will melt in you mouth and take you to the heaven :)",
                           Ingridients= "Sugar 100g, Cream Cheese 1000g, Blueberries 100g, Sour Cream 150g",
                           Description="1. Soften the cream cheese.",
                           Width= "680",
                           Height= "680"

                    }


                );
                context.SaveChanges();
            }
        }
    }
}