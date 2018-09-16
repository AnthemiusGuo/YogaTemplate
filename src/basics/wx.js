import wx from "weixin-js-sdk";

export default {
  _wx: wx,
  wxConfig: function(axios, share) {
    if (!share.title) {
      share.title = "匿名旅行者";
    }
    if (!share.desc) {
      share.desc = "匿名旅行者 - 泛摇滚文化社区";
    }
    if (!share.link) {
      share.link = window.location.href;
    }
    if (!share.imgUrl) {
      share.imgUrl =
        "https://anontraveler.oss-cn-shanghai.aliyuncs.com/medias/anontraveler/logo.jpg";
    }
    axios
      .post("/api/wxsig", { system: "gj", url: window.location.href })
      .then(json => {
        wx.config({
          // debug: true,
          appId: json.data.appId,
          timestamp: json.data.timestamp,
          nonceStr: json.data.nonceStr,
          signature: json.data.signature,
          jsApiList: [
            "onMenuShareTimeline",
            "onMenuShareAppMessage",
            "onMenuShareQQ",
            "onMenuShareWeibo",
            "onMenuShareQZone"
          ]
        });
        wx.ready(function() {
          wx.onMenuShareTimeline(share);
          wx.onMenuShareAppMessage(share);
          wx.onMenuShareQQ(share);
          wx.onMenuShareWeibo(share);
          wx.onMenuShareQZone(share);
        });
      })
      .catch(e => {
        console.log(e);
        alert(e.data.msg);
      });
  }
};
