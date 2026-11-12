package utils
{
   public class Utils
   {
      
      public function Utils()
      {
         super();
      }
      
      public static function shuffle(target:Array) : Array
      {
         var index:int = 0;
         var value:Object = null;
         if(!target)
         {
            return null;
         }
         var res:Array = target.concat();
         var m:int = target.length - 1;
         for(var i:int = m; i > 0; i--)
         {
            index = int(Math.random() * (i + 1));
            if(i != index)
            {
               value = res[index];
               res[index] = res[i];
               res[i] = value;
            }
         }
         return res;
      }
   }
}

