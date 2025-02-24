import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Blob "mo:base/Blob";
import Debug "mo:base/Debug";

actor {
  public query func greet(name : Text) : async Text {
    // 名前が空の場合の簡単なチェック
    if (name.size() == 0) {
       return "Hello, anonymous!";
    };
    let response : Text = "Hello, " # name # "!";
    
    // UTF-8 に変換してバイト列のサイズをチェック
    let maxAllowed : Nat = 2_097_152; // 2MB (2097152 バイト)
    let responseBlob : Blob = Text.encodeUtf8(response);
    let responseBytes : [Nat8] = Blob.toArray(responseBlob);
    if (responseBytes.size() >= maxAllowed) {
       // サイズオーバーの場合はエラーにする
       Debug.trap("Response size is too large");
    };
    return response;
  };

  public query (msg) func getPrincipal() : async Principal {
    return msg.caller;
  };
};
