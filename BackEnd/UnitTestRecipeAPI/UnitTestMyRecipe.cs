using MyRecipes.Controllers;
using MyRecipes.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using System;

namespace UniteTestMyRecipe
{
    [TestClass]
    public class UnitTestMyRecipe
    {
        public static readonly DbContextOptions<MyRecipesContext> options
            = new DbContextOptionsBuilder<MyRecipesContext>()
            .UseInMemoryDatabase(databaseName: "testDatabase")
            .Options;
        public static IConfiguration configuration = null;
        public static readonly IList<string> recipeNames = new List<string> { "steak", "cheesecake" };



        [TestInitialize]
        public void SetupDb()
        {
            using (var context = new MyRecipesContext(options))
            {
                Recipe recipe1 = new Recipe()
                {
                    Name = recipeNames[0]
                };

                Recipe recipe2 = new Recipe()
                {
                    Name = recipeNames[1]
                };

                context.Recipe.Add(recipe1);
                context.Recipe.Add(recipe2);
                context.SaveChanges();
            }
        }

        [TestMethod]
        public async Task TestPutRecipeNoContentStatusCode()
        {
            using (var context = new MyRecipesContext(options))
            {
                // Given
                string name = "putRecipe";
                Recipe recipe1 = context.Recipe.Where(x => x.Name == recipeNames[0]).Single();
                recipe1.Name = name;

                // When
                RecipesController recipeController = new RecipesController(context, configuration);
                IActionResult result = await recipeController.PutRecipe(recipe1.Id, recipe1) as IActionResult;

                // Then
                Assert.IsNotNull(result);
                Assert.IsInstanceOfType(result, typeof(NoContentResult));
            }
        }

        [TestMethod]
        public async Task TestPutRecipeUpdate()
        {
            using (var context = new MyRecipesContext(options))
            {
                // Given
                string name = "putRecipe";
                Recipe recipe1 = context.Recipe.Where(x => x.Name == recipeNames[0]).Single();
                recipe1.Name = name;

                // When
                RecipesController recipeController = new RecipesController(context, configuration);
                IActionResult result = await recipeController.PutRecipe(recipe1.Id, recipe1) as IActionResult;

                // Then
                recipe1 = context.Recipe.Where(x => x.Name == name).Single();
            }
        }

        [TestMethod]
        public async Task TestGetRecipe()
        {
            using (var context = new MyRecipesContext(options))
            {
                string name = "getRecipe";
                Recipe recipe1 = context.Recipe.Where(x => x.Name == recipeNames[0]).Single();
                recipe1.Name = name;
                RecipesController recipeController = new RecipesController(context, configuration);
                var okResult = recipeController.GetRecipe();

                // Assert
                Assert.IsNotNull(okResult);
                Assert.IsInstanceOfType(okResult, typeof(IEnumerable<Recipe>));
            }
        }

        [TestMethod]
        public async Task TestGetRecipeTag()
        {
            using (var context = new MyRecipesContext(options))
            {
            
                RecipesController recipeController = new RecipesController(context, configuration);
                var result = await recipeController.GetTagsRecipe("");

                // Assert
                Assert.IsNotNull(result);
                Assert.IsInstanceOfType(result, typeof(List<Recipe>));
            }
        }

        [TestMethod]
        public async Task TestGetRecipeId()
        {
            using (var context = new MyRecipesContext(options))
            {
                string name = "getRecipe";
                Recipe recipe1 = context.Recipe.Where(x => x.Name == recipeNames[0]).Single();
                recipe1.Name = name;
                RecipesController recipeController = new RecipesController(context, configuration);
                IActionResult okResult = await recipeController.GetRecipe(recipe1.Id) as IActionResult;

                // Assert
                Assert.IsNotNull(okResult);
                Assert.IsInstanceOfType(okResult, typeof(OkObjectResult));
            }
        }

        [TestMethod]
        public async Task TestGetRecipeIdFail()
        {
            using (var context = new MyRecipesContext(options))
            {
                
                RecipesController recipeController = new RecipesController(context, configuration);
                IActionResult failResult = await recipeController.GetRecipe(4) as IActionResult;

                // Assert
                Assert.IsNotNull(failResult);
                Assert.IsInstanceOfType(failResult, typeof(NotFoundResult));
            }
        }

        [TestMethod]
        public async Task TestDeleteRecipe()
        {
            using (var context = new MyRecipesContext(options))
            {
                string name = "deleteRecipe";
                Recipe recipe1 = context.Recipe.Where(x => x.Name == recipeNames[0]).Single();
                recipe1.Name = name;

                RecipesController recipeController = new RecipesController(context, configuration);
                IActionResult okResult = await recipeController.DeleteRecipe(recipe1.Id) as IActionResult;

                // Assert
                Assert.IsNotNull(okResult);
                Assert.IsInstanceOfType(okResult, typeof(OkObjectResult));
            }
        }



        [TestMethod]
        public async Task TestDeleteFailRecipe()
        {
            using (var context = new MyRecipesContext(options))
            {
                

                RecipesController recipeController = new RecipesController(context, configuration);
                IActionResult failResult = await recipeController.DeleteRecipe(4) as IActionResult;

                // Assert
                Assert.IsNotNull(failResult);
                Assert.IsInstanceOfType(failResult, typeof(NotFoundResult));
            }
        }

        [TestMethod]
        public async Task TestPostRecipeAlreadyExist()
        {
            using (var context = new MyRecipesContext(options))
            {
                string name = "postRecipe";
                Recipe recipe1 = context.Recipe.Where(x => x.Name == recipeNames[0]).Single();
                recipe1.Name = name;
                try
                {
                    RecipesController recipeController = new RecipesController(context, configuration);
                    IActionResult okResult = await recipeController.PostRecipe(recipe1) as IActionResult;
                }
                catch (Exception e)
                {
                    // Assert
                    Assert.IsInstanceOfType(e,typeof(ArgumentException));
                }
            }
        }

        public async Task TestUploadFileFail()
        {
            using (var context = new MyRecipesContext(options))
            {
                RecipeImage image = new RecipeImage();
                try
                {
                    RecipesController recipeController = new RecipesController(context, configuration);
                    IActionResult okResult = await recipeController.UploadRecipe(image) as IActionResult;
                }
                catch (Exception e)
                {
                    // Assert
                    Assert.IsInstanceOfType(e, typeof(ArgumentException));
                }
            }
        }

        [TestMethod]
        public async Task TestPostRecipe()
        {
            using (var context = new MyRecipesContext(options))
            {
                Recipe recipe = new Recipe();

                
                    RecipesController recipeController = new RecipesController(context, configuration);
                    IActionResult okResult = await recipeController.PostRecipe(recipe) as IActionResult;


                // Assert
                Assert.IsNotNull(okResult);
                Assert.IsInstanceOfType(okResult, typeof(CreatedAtActionResult));
            }
        }

        [TestCleanup]
        public void ClearDb()
        {
            using (var context = new MyRecipesContext(options))
            {
                context.Recipe.RemoveRange(context.Recipe);
                context.SaveChanges();
            };
        }
    }
}