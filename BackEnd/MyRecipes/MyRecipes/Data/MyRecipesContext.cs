using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace MyRecipes.Models
{
    public class MyRecipesContext : DbContext
    {
        public MyRecipesContext (DbContextOptions<MyRecipesContext> options)
            : base(options)
        {
        }

        public DbSet<MyRecipes.Models.Recipe> Recipe { get; set; }
    }
}
