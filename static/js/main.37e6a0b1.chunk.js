(this["webpackJsonplogcompare-react"]=this["webpackJsonplogcompare-react"]||[]).push([[0],{106:function(e,t,a){},123:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(14),i=a.n(c),o=(a(106),a(26)),s=a(13),u=a.n(s),l=a(70),p=a(19),d=a(91),j=a(170),b=a(173),m=a(36),h=a(161),x=a(171),f=a(172),O=a(162),g=a(164),v=a(163),w=a(165),k=a(166),y=a(167),C=a(175),P=a(168),F=a(169),S=a(21),T=a(11),M=a(2),I=a(8);function D(e){return Object(I.jsxs)(S.c,{rotated:!0,data:e.data,children:[Object(I.jsx)(T.b,{factory:M.zb}),Object(I.jsx)(S.a,{}),Object(I.jsx)(S.g,{}),Object(I.jsx)(S.b,{valueField:"percentrankdps",argumentField:"account",name:"Percentile DPS"}),Object(I.jsx)(S.b,{valueField:"percentrankmight",argumentField:"account",name:"Percentile Might"}),Object(I.jsx)(S.b,{valueField:"percentrankquickness",argumentField:"account",name:"Percentile Quickness"}),Object(I.jsx)(S.b,{valueField:"percentrankalacrity",argumentField:"account",name:"Percentile Alacrity"}),Object(I.jsx)(S.b,{valueField:"percentrankfury",argumentField:"account",name:"Percentile Fury"}),Object(I.jsx)(T.j,{}),Object(I.jsx)(S.d,{}),Object(I.jsx)(T.f,{}),Object(I.jsx)(S.f,{}),Object(I.jsx)(S.e,{text:"Compare Percentiles"})]})}var z=Object(w.a)((function(e){return{root:{display:"flex","& > *":{margin:e.spacing(1)}},small:{width:e.spacing(3),height:e.spacing(3)},large:{width:e.spacing(7),height:e.spacing(7)}}}));function N(e){var t=z();return e.data?Object(I.jsxs)(k.a,{variant:"outlined",children:[Object(I.jsx)(y.a,{avatar:Object(I.jsx)(C.a,{variant:"square",className:t.large,alt:e.data.metadata.fightName,src:e.data.metadata.fightIcon}),title:e.data.metadata.fightName,subheader:"".concat(e.data.metadata.permaLink," \n LogCompare ID: ").concat(e.data.metadata.tryID)}),Object(I.jsx)(P.a,{children:Object(I.jsx)(D,{data:e.data.data})})]}):Object(I.jsxs)(k.a,{variant:"outlined",children:[Object(I.jsx)(y.a,{avatar:Object(I.jsx)(C.a,{variant:"square",className:t.large,alt:void 0,src:void 0}),title:void 0,subheader:void 0}),Object(I.jsx)(P.a,{children:!e.isEmpty&&Object(I.jsx)(F.a,{})})]})}var L=a(174),A=Object(w.a)((function(e){return Object(L.a)({previewChip:{minWidth:160,maxWidth:210},root:{width:"100%",backgroundColor:e.palette.grey[300],display:"flex",flexDirection:"row",padding:0}})}));function E(){var e=Object(n.useState)([]),t=Object(p.a)(e,2),a=t[0],r=t[1],c=Object(n.useState)(new Map),i=Object(p.a)(c,2),s=i[0],w=i[1],k=Object(n.useState)(new Map),y=Object(p.a)(k,2),C=y[0],P=y[1],F=Object(n.useState)(""),S=Object(p.a)(F,2),T=S[0],M=S[1],D="http://127.0.0.1:8000",z=A();function L(e){return E.apply(this,arguments)}function E(){return(E=Object(l.a)(u.a.mark((function e(t){var a,n,r,c,i,o;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!t){e.next=28;break}return e.prev=1,a={mode:"cors",Origin:"http://localhost:3000","Content-Type":"application/json","Access-Control-Allow-Methods":"POST, GET, OPTIONS"},e.next=5,fetch("".concat(D,"/api/encounters/upload_report/?id=").concat(t),{method:"POST",headers:a});case 5:if(!(n=e.sent).ok){e.next=23;break}return e.next=9,n.json();case 9:return r=e.sent,e.next=12,fetch("".concat(D,"/api/percentiles/?name=").concat(r.fightName));case 12:if(!(c=e.sent).ok){e.next=22;break}return e.next=16,c.json();case 16:return i=e.sent,void 0,o=i.filter((function(e){return e.tryID===t})),e.abrupt("return",{metadata:r,data:o});case 22:return e.abrupt("return",null);case 23:e.next=28;break;case 25:return e.prev=25,e.t0=e.catch(1),e.abrupt("return",Promise.reject(e.t0));case 28:return e.abrupt("return",null);case 29:case"end":return e.stop()}}),e,null,[[1,25]])})))).apply(this,arguments)}function B(){return(B=Object(l.a)(u.a.mark((function e(){var t,n,r,c,i;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t=function(e){var t=new FormData;return t.append("file",e),t.append("generator","ei"),t.append("json","1"),t},n={mode:"cors",Origin:"http://localhost:3000","Content-Type":"multipart/form-data","Access-Control-Allow-Methods":"POST, GET, OPTIONS"},console.log(n),r=Object(o.a)(a),e.prev=4,i=u.a.mark((function e(){var a,n,r,i;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(a=c.value,0===C.get(a.name)){e.next=3;break}return e.abrupt("return","continue");case 3:return e.prev=3,e.next=6,fetch("https://dps.report/uploadContent",{method:"POST",body:t(a)});case 6:return n=e.sent,e.next=9,n.json();case 9:return r=e.sent,console.log(r),P((function(e){return new Map(e).set(a.name,30)})),e.next=14,L(r.id);case 14:(i=e.sent)&&(P((function(e){return new Map(e).set(a.name,70)})),i.metadata.permaLink=r.permalink,P((function(e){return new Map(e).set(a.name,100)})),w((function(e){return new Map(e).set(a.name,i)}))),e.next=21;break;case 18:e.prev=18,e.t0=e.catch(3),console.error(e.t0);case 21:case"end":return e.stop()}}),e,null,[[3,18]])})),r.s();case 7:if((c=r.n()).done){e.next=14;break}return e.delegateYield(i(),"t0",9);case 9:if("continue"!==e.t0){e.next=12;break}return e.abrupt("continue",12);case 12:e.next=7;break;case 14:e.next=19;break;case 16:e.prev=16,e.t1=e.catch(4),r.e(e.t1);case 19:return e.prev=19,r.f(),e.finish(19);case 22:case"end":return e.stop()}}),e,null,[[4,16,19,22]])})))).apply(this,arguments)}return Object(I.jsxs)(j.a,{maxWidth:"lg",children:[Object(I.jsx)(b.a,{paddingTop:2,paddingBottom:2,marginBottom:1,color:"primary.main",children:Object(I.jsx)(m.a,{variant:"h2",align:"center",children:"Log Compare"})}),Object(I.jsx)(d.a,{maxFileSize:2e7,acceptedFiles:[".evtc",".zevtc"],onChange:function(e){var t=new Map(C);e.forEach((function(e){t.has(e.name)||t.set(e.name,0)})),r(e),P(t)},filesLimit:10,onDelete:function(e){r(a.splice(a.findIndex((function(t){return t.name===e.name})),0)),P((function(){var t=C;return t.delete(e.name),t}))},showPreviews:!0,showPreviewsInDropzone:!1,useChipsForPreview:!0,previewGridProps:{container:{spacing:1,direction:"row"}},previewChipProps:{classes:{root:z.previewChip}},previewText:"Selected files"}),Object(I.jsxs)(b.a,{marginTop:2,marginBottom:2,children:[Object(I.jsx)(h.a,{variant:"outlined",size:"large",color:"primary",onClick:function(){return B.apply(this,arguments)},children:"Compare"}),Object(I.jsx)(h.a,{variant:"outlined",size:"large",color:"primary",onClick:function(){return window.location.reload()},children:"Refresh Page"}),Object(I.jsx)(h.a,{variant:"outlined",size:"large",color:"primary",onClick:function(){r([]),w(new Map),P(new Map),M("")},children:"Clear All"}),Object(I.jsx)(O.a,{dense:!0,className:z.root,children:a.map((function(e){return Object(I.jsxs)(g.a,{button:!0,divider:!0,onClick:function(){M(e.name)},children:[Object(I.jsx)(x.a,{children:Object(I.jsx)(f.a,{variant:"determinate",value:C.get(e.name),style:{marginRight:10}})}),Object(I.jsx)(v.a,{primary:"File: ".concat(e.name)})]},e.name)}))})]}),Object(I.jsx)(N,{isEmpty:0===s.size,data:s.get(T)})]})}var B=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,177)).then((function(t){var a=t.getCLS,n=t.getFID,r=t.getFCP,c=t.getLCP,i=t.getTTFB;a(e),n(e),r(e),c(e),i(e)}))};i.a.render(Object(I.jsx)(r.a.StrictMode,{children:Object(I.jsx)(E,{})}),document.getElementById("root")),B()}},[[123,1,2]]]);
//# sourceMappingURL=main.37e6a0b1.chunk.js.map