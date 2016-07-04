# Married Bob Fetcher
![Married Bob](https://raw.githubusercontent.com/NuSkooler/enigma-bbs-married_bob_evt/master/mb.png)

A [Married Bob](http://marriedbob.tumblr.com/) fetcher event mod for [ENiGMA½ BBS](https://github.com/NuSkooler/enigma-bbs)!

# Installation
## Get the Mod
### From Archive
TODO document me!

### From Git

    cd /path/to/enigma-bbs/mods
    git clone https://github.com/NuSkooler/enigma-bbs-married_bob_evt.git married_bob_evt
    cd married_bob_evt
    npm install


## Add to the Scheduler
Add an event to fetch/update your Married Bob cache to your ENiGMA½ Event Scheduler in `~/.config/enigma-bbs/config.hjson`:

```hjson
eventScheduler: {
  events: {
    fetchLatestMarriedBob: {
      schedule: every 24 hours
      action: @method:mods/married_bob_evt/married_bob_evt.js:fetchLatestMarriedBob
    }
  }
}
```

## Display a Random Piece!
You can now display a random piece directly from the Married Bob cache with a entry in your `menu.hjson`:

```hjson
randomMarriedBobArt: {
  desc: Viewing Married Bob
  art: mods/married_bob_evt/cache/mb-
  next: someOtherMenu
}
```

# Special Thanks
Thanks to [Luciano Ayres](https://github.com/lucianoayres/married-bob-ansi-art-comic) for Married Bob of course!