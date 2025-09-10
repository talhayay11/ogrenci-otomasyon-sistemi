using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using OgrenciOtomasyon.API.Models;

namespace OgrenciOtomasyon.API.Data;

public class ApplicationDbContext : IdentityDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Student> Students => Set<Student>();
    public DbSet<Teacher> Teachers => Set<Teacher>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<Grade> Grades => Set<Grade>();
    public DbSet<Attendance> Attendances => Set<Attendance>();
    public DbSet<StudentComment> StudentComments => Set<StudentComment>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Student - Course many-to-many
        builder.Entity<Student>()
            .HasMany(s => s.Courses)
            .WithMany(c => c.Students)
            .UsingEntity(j => j.ToTable("CourseStudents"));

        // Teacher - Course one-to-many
        builder.Entity<Course>()
            .HasOne(c => c.Teacher)
            .WithMany(t => t.Courses)
            .HasForeignKey(c => c.TeacherId)
            .OnDelete(DeleteBehavior.Restrict);

        // Grade unique per student-course
        builder.Entity<Grade>()
            .HasIndex(g => new { g.StudentId, g.CourseId })
            .IsUnique();

        builder.Entity<Attendance>()
            .HasIndex(a => new { a.StudentId, a.CourseId, a.Date })
            .IsUnique();

        builder.Entity<Student>()
            .HasIndex(s => s.UserId)
            .IsUnique(false);

        builder.Entity<Teacher>()
            .HasIndex(t => t.UserId)
            .IsUnique(false);
    }
}




