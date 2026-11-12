package CoinMenu
{
   public class menuState
   {
      
      private var states:Object;
      
      public var current:String;
      
      public var previous:String;
      
      public function menuState()
      {
         super();
         this.states = new Object();
      }
      
      public function setState(name:String) : void
      {
         if(this.current == null)
         {
            this.current = name;
            this.states[this.current].state.enter();
            return;
         }
         if(this.current == name)
         {
            return;
         }
         this.states[this.current].state.exit();
         this.previous = this.current;
         this.current = name;
         this.states[this.current].state.enter();
      }
      
      public function addState(name:String, stateObj:MenuBase) : void
      {
         this.states[name] = {"state":stateObj};
      }
      
      public function update() : void
      {
         this.states[this.current].state.update();
      }
   }
}

