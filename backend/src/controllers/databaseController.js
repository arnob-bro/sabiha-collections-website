class DatabaseController {
  constructor(databaseInspectorService) {
    this.databaseInspectorService = databaseInspectorService;

    this.getSnapshot = this.getSnapshot.bind(this);
  }

  async getSnapshot(req, res) {
    try {
      const tables = await this.databaseInspectorService.getTablesSnapshot();
      res.status(200).json({
        success: true,
        totalTables: tables.length,
        tables,
      });
    } catch (err) {
      console.error("Error fetching database snapshot:", err);
      res.status(500).json({
        success: false,
        message: "Unable to fetch database snapshot",
      });
    }
  }
}

module.exports = DatabaseController;

