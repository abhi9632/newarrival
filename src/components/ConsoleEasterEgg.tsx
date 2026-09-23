"use client";

import * as React from "react";

const MESSAGE =
  "Four facts, one line. Drag Priya's course end date on /timeline all the way and watch it arrive.";

export function ConsoleEasterEgg() {
  React.useEffect(() => {
    console.log("%cNewArrival%c " + MESSAGE, "font-weight:700", "font-weight:400");
  }, []);

  return null;
}
