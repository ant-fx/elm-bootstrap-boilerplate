port module Main exposing (..)

import Tests.Tests
import Test.Runner.Node exposing (run)
import Json.Encode exposing (Value)


main : Program Never
main =
    run emit Tests.Tests.all


port emit : ( String, Value ) -> Cmd msg
