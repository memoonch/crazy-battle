package assets
{
   public class EmbedResourse
   {
      
      private var _inventoryClass:Class = EmbedResourse__inventoryClass;
      
      public var inventory:XML = new XML(new this._inventoryClass());
      
      private var _weaponsClass:Class = EmbedResourse__weaponsClass;
      
      public var weapons:XML = new XML(new this._weaponsClass());
      
      private var _ompsClass:Class = EmbedResourse__ompsClass;
      
      public var omps:XML = new XML(new this._ompsClass());
      
      private var _enemysClass:Class = EmbedResourse__enemysClass;
      
      public var enemys:XML = new XML(new this._enemysClass());
      
      private var _levelsClass:Class = EmbedResourse__levelsClass;
      
      public var levels:XML = new XML(new this._levelsClass());
      
      public function EmbedResourse()
      {
         super();
      }
   }
}

