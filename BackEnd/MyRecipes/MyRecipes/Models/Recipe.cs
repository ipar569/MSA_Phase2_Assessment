using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyRecipes.Models
{
    public class Recipe
    {
       
        public int Id { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public string Author { get; set; }
        public string Tags { get; set; }
        public string Uploaded { get; set; }
        public string Overview { get; set; }
        public string Ingridients { get; set; }
        public string Description { get; set; }
        public string Width { get; set; }
        public string Height { get; set; }

    }

}
