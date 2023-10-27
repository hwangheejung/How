const onPopup = ({ id }) => {
  //팝업 관리

  var myWindow = window.open(
    `routindetail/${id}`,
    "window_name",
    "width=430,height=500,location=no,status=no,scrollbars=yes,top=200,left=100"
  );

  myWindow.document.write("<p>안녕</p>");
};

export default onPopup;
