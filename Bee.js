;(function() {
  var root =
    (typeof self == "object" && self.self == self && self) ||
    (typeof global == "object" && global.global == global && global) ||
    this ||
    {}

  var ArrayProto = Array.prototype

  var push = ArrayProto.push

  var _ = function(obj) {
    if (obj instanceof _) return obj
    if (!(this instanceof _)) return new _(obj)
    this._wrapped = obj
  }

  if (typeof exports != "undefined" && !exports.nodeType) {
    if (typeof module != "undefined" && !module.nodeType && module.exports) {
      exports = module.exports = _
    }
    exports._ = _
  } else {
    root._ = _
  }

  _.VERSION = "0.1"

  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1

  var isArrayLike = function(collection) {
    var length = collection.length
    return typeof length == "number" && length >= 0 && length <= MAX_ARRAY_INDEX
  }

  _.each = function(obj, callback) {
    var length,
      i = 0

    if (isArrayLike(obj)) {
      length = obj.length
      for (; i < length; i++) {
        if (callback.call(obj[i], obj[i], i) === false) {
          break
        }
      }
    } else {
      for (i in obj) {
        if (callback.call(obj[i], obj[i], i) === false) {
          break
        }
      }
    }

    return obj
  }

  _.isFunction = function(obj) {
    return typeof obj == "function" || false
  }

  _.functions = function(obj) {
    var names = []
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key)
    }
    return names.sort()
  }

  _.reverse = function(string) {
    return string
      .split("")
      .reverse()
      .join("")
  }

  /**
   * 获取链接参数
   * @param {String} name
   */
  ;(_.getUrlLocalparam = function(name) {
    var query = window.location.search.substring(1)
    var vars = query.split("&")
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=")
      if (pair[0] === name) {
        return decodeURI(pair[1])
      }
    }
    return ""
  }),
    /**
     * 获取链接参数，无法匹配中文以及特殊字符
     * @param {String} name
     */
    (_.getURLParam = function(name) {
      return (
        (window.location.href.match(new RegExp(`${name}=(\\w+)`)) || [])[1] ||
        ""
      )
    })

  /**
   * 移动端初始化rem
   */
  _.initRem = function() {
    var doc = document.documentElement
    var psd = 375
    var dpr = 1
    var scale = 1 / dpr
    var resize = "orientationchange" in window ? "orientationchange" : "resize"
    var meta = document.createElement("meta")
    meta.name = "viewport"
    meta.content =
      "width=device-width, user-scalable=no, initial-scale=" +
      scale +
      ", maximum-scale=" +
      scale +
      ", minimum-scale=" +
      scale

    doc.appendChild(meta)

    function recalc() {
      var width = doc.clientWidth

      if (width / dpr > psd) {
        width = psd * dpr
      }
      doc.dataset.width = width
      doc.dataset.persent = 100 * (width / psd)
      doc.style.fontSize = 100 * (width / psd) + "px"
    }

    recalc()

    if (document.addEventListener) {
      window.addEventListener(resize, recalc, false)
    }
  }

  _.getLocalTime = function(date) {
    let Y = date.getFullYear()
    let M = date.getMonth() + 1
    let D = date.getDate()
    let h = date.getHours()
    let m = date.getMinutes()
    return (
      Y +
      "-" +
      (M < 10 ? "0" + M : M) +
      "-" +
      (D < 10 ? "0" + D : D) +
      " " +
      (h < 10 ? "0" + h : h) +
      ":" +
      (m < 10 ? "0" + m : m) +
      ":00"
    )
  }

  _.toString = function(val) {
    return val == null
      ? ""
      : typeof val === "object"
        ? JSON.stringify(val, null, 2)
        : String(val)
  }

  _.isObject = function(obj) {
    return obj !== null && typeof obj === "object"
  }

  _.isRegExp = function(v) {
    return _toString.call(v) === "[object RegExp]"
  }

  _.isPlainObject = function(obj) {
    return _toString.call(obj) === "[object Object]"
  }

  /**
   * Check if two values are loosely equal - that is,
   * if they are plain objects, do they have the same shape?
   */
  _.looseEqual = function(a, b) {
    if (a === b) return true
    const isObjectA = isObject(a)
    const isObjectB = isObject(b)
    if (isObjectA && isObjectB) {
      try {
        const isArrayA = Array.isArray(a)
        const isArrayB = Array.isArray(b)
        if (isArrayA && isArrayB) {
          return (
            a.length === b.length &&
            a.every((e, i) => {
              return looseEqual(e, b[i])
            })
          )
        } else if (!isArrayA && !isArrayB) {
          const keysA = Object.keys(a)
          const keysB = Object.keys(b)
          return (
            keysA.length === keysB.length &&
            keysA.every(key => {
              return looseEqual(a[key], b[key])
            })
          )
        } else {
          /* istanbul ignore next */
          return false
        }
      } catch (e) {
        /* istanbul ignore next */
        return false
      }
    } else if (!isObjectA && !isObjectB) {
      return String(a) === String(b)
    } else {
      return false
    }
  }

  /**
   * 网络图像文件转Base64
   */
  _.getBase64Image = function (img) {
    var canvas = document.createElement("canvas")
    canvas.width = img.width
    canvas.height = img.height
    var ctx = canvas.getContext("2d")
    ctx.drawImage(img, 0, 0, img.width, img.height)
    var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase()
    var dataURL = canvas.toDataURL("image/" + ext)
    return dataURL
  }

  /**
   *Base64字符串转二进制
   */
  _.dataURLtoBlob = function (dataurl) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], {
      type: mime
    })
  }

  /**
   * 在 _.mixin(_) 前添加自己定义的方法
   * @param { Object } obj
   */
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = (_[name] = obj[name])
      _.prototype[name] = function() {
        var args = [this._wrapped]

        push.apply(args, arguments)

        return func.apply(_, args)
      }
    })
    return _
  }

  _.mixin(_)
})()
