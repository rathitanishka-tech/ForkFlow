export class RecommendationValidator {
  /**
   * Validates the menu item ID from the request.
   * @param menuItemId The ID to validate.
   * @throws {Error} if the menuItemId is missing or invalid.
   */
  public validateMenuItemId(menuItemId: string | null): void {
    if (!menuItemId || typeof menuItemId !== "string") {
      throw new Error("A valid 'menuItemId' query parameter is required.");
    }
    // In a real-world scenario, you might add more checks, e.g., CUID/UUID format.
  }
}
