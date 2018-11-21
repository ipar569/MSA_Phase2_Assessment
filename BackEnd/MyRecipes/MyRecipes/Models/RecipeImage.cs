using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyRecipes.Models
{
    public class RecipeImage
    {
        public string Name { get; set; }
        public string Tags { get; set; }
        public string Author { get; set; }
        public string Overview { get; set; }
        public string Ingridients { get; set; }
        public string Description { get; set; }
        public IFormFile Image { get; set; }
    }
}
