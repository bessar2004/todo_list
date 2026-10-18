using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TodoApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddKanbanFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsCompleted",
                table: "TodoItems");

            migrationBuilder.AddColumn<int>(
                name: "Priority",
                table: "TodoItems",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "TodoItems",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Priority",
                table: "TodoItems");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "TodoItems");

            migrationBuilder.AddColumn<bool>(
                name: "IsCompleted",
                table: "TodoItems",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
