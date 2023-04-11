/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { createRef } from "react";
import { Table } from "react-bootstrap";
import { connect } from "react-redux";
import { Portlet, PortletBody } from "../../partials/content/Portlet";
import { Formik } from "formik";
import clsx from "clsx";
import {
  Button,
  Dropdown,
  Modal,
  OverlayTrigger,
  Tooltip,
  Form,
  Col,
} from "react-bootstrap";
import {
  getOutletList,
  addOutlet,
  editOutlet,
  editOutletStatus,
  deleteOutlet,
  getAddress,
  getAllList,
  exportOutlet,
  importOutlet,
  getRandomAcc,
  createCSVRequest,
  importScriptStatus
} from "../../crud/auth.crud";
import { DropzoneArea } from "material-ui-dropzone";
import { TitleComponent } from "../FormComponents/TitleComponent";
import Pagination from "react-js-pagination";
import {
  PictureAsPdf,
  OndemandVideo,
  BrandingWatermark,
  NoteAdd
} from "@material-ui/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { paginationTexts } from "../../../_metronic/utils/utils";
import { CircularProgress } from "@material-ui/core";
import { Beforeunload } from 'react-beforeunload';

var pwdValid = /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/;
var space = /\s/;

class Outlets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      outletData: [],
      outletCount: 0,
      startDate: null,
      endDate: null,
      showAlert: false,
      loading: false,
      searchValue: "",
      limit: 25,
      status: "",
      sortBy: "createdAt",
      sortOrder: "DESC",
      activePage: 1,
      isFocus: false,
      show: false,
      modalType: "",
      currentOutlet: null,
      validated: false,
      disabledBtn: false,
      activeTabs: 0,
      outlet: [],
      address: [],
      outletName: [],
      importXlsxArr: [],
      randomNumber: 0,
      scriptImporting: false
    };
    this.inputRef = createRef();
  }

  getRandomNumber = async () => {
    const { authToken } = this.props;
    await getRandomAcc(authToken).then((data) => {
      this.setState({ randomNumber: data.data.payload.randomAcc });
    })
  }

  componentDidMount = async () => {
    this.getOutletList();
    this.getAllList();
  };
  
  getOutletList = async (searchData) => {
    this.setState({ loading: true });
    const { authToken } = this.props;
    var limitV = this.state.limit;
    var sortByV = this.state.sortBy;
    var sortOrderV = this.state.sortOrder;
    var activePage = this.state.activePage;
    var status =
      this.state.status === 0 || this.state.status === 1
        ? this.state.status
        : null;
    var search =
      this.state.searchValue !== undefined ? this.state.searchValue : null;
    await getOutletList(
      authToken,
      search,
      limitV,
      sortByV,
      sortOrderV,
      activePage,
      status
    )
      .then((result) => {
        this.setState({
          loading: false,
          outletData: result.data.payload ? result.data.payload.data.rows : [],
          outletCount: result.data.payload && result.data.payload.data.count,
        });
      })
      .catch((err) => {
        this.setState({
          loading: false,
          outletData: [],
          outletCount: 0,
        });
        if (err.response && err.response.data.message === "jwt expired") {
          window.location.href = "/admin/logout";
        }
      });
  };

  getAllList = async (searchData) => {
    const { authToken } = this.props;

    await getAllList(authToken).then(result => {
      this.setState({
        outletName: result.data.payload ? result.data.payload.data.rows : [],
      });
    }).catch(err => {
      this.setState({
        outletName: [],
      });
      if (err.response && (err.response.data.message === "jwt expired")) {
        window.location.href = "/admin/logout";
      }
    });
  }

  clear = () => {
    this.setState({ searchValue: "" });
    setTimeout(() => {
      this.getOutletList();
    }, 500);
  };

  handleSearchChange = (event) => {
    this.setState({ searchValue: event.target.value });
    if (event.target.value.length === 0) {
      this.getOutletList();
    }
  };

  handleStatus = (value) => {
    this.setState({ status: value });
    setTimeout(() => {
      this.getOutletList();
    }, 500);
  };

  handleSorting = (sortBy, sortOrder) => {
    this.setState({
      sortBy: sortBy,
      sortOrder: sortOrder,
    });
    setTimeout(() => {
      this.getOutletList();
    }, 500);
  };

  handleSelect = (number) => {
    this.setState({ activePage: number });
    setTimeout(() => {
      this.getOutletList();
    }, 500);
  };

  handleModal = (value, currentOutlet) => {

    if (value === "Edit") {
      var arr = [];
      var days = [
        { name: "sunday", checked: false },
        { name: "tuesday", checked: false },
        { name: "wednesday", checked: false },
        { name: "thursday", checked: false },
        { name: "friday", checked: false },
        { name: "saturday", checked: false },
      ];

      var d = days.map((item) => {
        currentOutlet.days.map((it) => {
          if (item.name == it.name) {
            item = it;
          }
          return item;
        });
        return item;
      });
      var obj = {
        ...currentOutlet,
        days: d,
        address: currentOutlet.addressOrg,
        image_url: currentOutlet.outlet_url,
        outlet_url: "",
      };
      arr.push(obj);
      this.setState({
        modalType: value,
        show: true,
        outlet: arr,
        currentOutlet
      });
    } else {
      if (value === "Add") {
        this.getRandomNumber();
      }
      this.setState({ modalType: value, show: true, currentOutlet });
    }
  };

  handleClose = () => {
    this.setState({ show: false, disabledBtn: false, activeTabs: 0, outlet: [] });
  };

  changeFocus = () => {
    this.setState({ isFocus: true });
  };

  handleShow = (e) => {
    this.setState({
      show: true,
    });
  };

  handleSwitchChange = async (value, item) => {
    const { authToken } = this.props;
    const { currentOutlet } = this.state;
    var data = {
      id: currentOutlet.id,
      outlet_name: currentOutlet.outlet_name,
      status: !currentOutlet.status,
      type: "updateStatus",
    };
    await editOutletStatus(authToken, data)
      .then((result) => {
        toast.success(result.data.message, {
          className: "green-css",
        });
        this.handleClose();
      })
      .catch((err) => {
        var msg = err.response ? err.response.data.message : err.message;
        toast.error(msg, {
          className: "red-css",
        });
      });
    setTimeout(() => {
      this.getOutletList();
    }, 500);
  };

  handleChange = (key, value) => {
    this.setState({ [key]: value });
  };

  handleSubmit = () => {
    this.setState({ activePage: 1 });
    setTimeout(() => {
      this.getOutletList();
    }, 500);
  };

  handleReset = () => {
    window.location.reload();
  };
  getAddress = async (region) => {
    const { authToken } = this.props;

    await getAddress(authToken, region)
      .then((result) => {
        var arr = [];
        arr.push(result.data.payload);
        var d = [];
        if (this.state.outlet.length > 0) {
          d = this.state.outlet.map((item, i) =>
            Object.assign({}, item, result.data.payload)
          );
        } else {
          d.push(result.data.payload);
        }
        this.setState({
          outlet: d,
        });
      })
      .catch((err) => {
        if (err.response && err.response.data.message === "jwt expired") {
          window.location.href = "/admin/logout";
        }
      });
  };
  getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let region = {
          lat: position.coords.latitude,
          long: position.coords.longitude,
        };
        this.getAddress(region);
      },
      (error) => console.log(error)
    );
  };

  handleDelete = async (event) => {
    this.setState({ disabledBtn: true });
    const { authToken } = this.props;
    var data = {
      id: this.state.currentOutlet.id,
    };
    await deleteOutlet(authToken, data)
      .then((result) => {
        this.handleClose();
        toast.success(result.data.message, {
          className: "green-css",
        });
      })
      .catch((err) => {
        this.handleClose();
        var msg = err.response ? err.response.data.message : err.message;
        toast.error(msg, {
          className: "red-css",
        });
      });
    setTimeout(() => {
      this.setState({ disabledBtn: false });
      this.getOutletList();
    }, 500);
  };

  handleEditSubmit = async (values, setSubmitting) => {
    const { authToken } = this.props;
    var dataVal = values; //this.state.outlet;
    var postdata = dataVal[0];
    postdata.id = this.state.outlet && this.state.outlet[0]?.id;
    const data = new FormData();
    postdata.outlet_name = postdata.outlet_name?.trim();
    postdata.outlet_email = postdata.outlet_email?.trim();
    delete postdata.image_url;

    if (postdata.outlet_url != "") {
      data.append("file", postdata.outlet_url);
      delete postdata.outlet_url;
    }
    data.append("data", JSON.stringify(postdata));

    await editOutlet(authToken, data)
      .then((result) => {
        setSubmitting(false);
        this.handleClose();
        this.setState({
          activeTabs: 0,
          outlet: [],
        });
        toast.success(result.data.message, {
          className: "green-css",
        });
      })
      .catch((errors) => {
        setSubmitting(false);
        this.handleClose();
        var msg = errors.response
          ? errors.response.data.message
          : errors.message;
        toast.error(msg, {
          className: "red-css",
        });
      });
    setTimeout(() => {
      this.getOutletList();
    }, 500);
  };

  handleAddSubmit = async (values, setSubmitting) => {
    const { authToken } = this.props;
    var dataVal = values; //this.state.outlet;
    var postdata = dataVal[0];
    const data = new FormData();
    postdata.outlet_name = postdata.outlet_name?.trim();
    postdata.outlet_email = postdata.outlet_email?.trim();
    delete postdata.image_url;
    if (postdata.outlet_url) {
      data.append("file", postdata.outlet_url);
      delete postdata.outlet_url;
    }
    data.append("data", JSON.stringify(postdata));

    await addOutlet(authToken, data)
      .then((result) => {
        setSubmitting(false);
        this.handleClose();
        this.setState({
          activeTabs: 0,
          outlet: [],
        });
        toast.success(result.data.message, {
          className: "green-css",
        });
      })
      .catch((errors) => {
        setSubmitting(false);
        this.handleClose();
        var msg = errors.response
          ? errors.response.data.message
          : errors.message;
        toast.error(msg, {
          className: "red-css",
        });
      });
    setTimeout(() => {
      this.getOutletList();
    }, 500);
  };

  updateState(e, key) {
    var arr = [];
    var d = [];
    if (key === "outlet_url" && e.name != "") {

      var image_url = ""
      if (e) {
        var reader = new FileReader();
        if (e.type.startsWith("image/")
        ) {
          reader.readAsDataURL(e);
          reader.onload = function () {
            // arr.push({ image_url: reader.result });
            image_url = reader.result;
          };
        }
      }
      arr.push({ outlet_url: e, image_url });
      if (this.state.outlet.length > 0) {
        d = this.state.outlet.map((item, i) => Object.assign({}, item, arr[i]));
      } else {
        d.push({ outlet_url: e, image_url });
      }
      this.setState({
        outlet: d,
      });
    } else if (key != "outlet_url") {
      arr.push({ [key]: e.target.value });

      if (this.state.outlet.length > 0) {
        d = this.state.outlet.map((item, i) => Object.assign({}, item, arr[i]));
      } else {
        d.push({ [key]: e.target.value });
      }
      this.setState({
        outlet: d,
      });
    }


  };

  preventFloat = (e) => {
    if (e.key === 'e' || e.key === "." || e.key === "+" || e.key === "-") {
      e.preventDefault();
    }
  }

  onImageHandle = (props, files) => {
    props.setFieldValue("outlet_url", files[0]);
    this.updateState(files[0], "outlet_url");
    if (files && files.length > 0) {
      var reader = new FileReader();
      if (
        files[0] &&
        files[0].type.startsWith("image/")
      ) {
        reader.readAsDataURL(files[0]);
        reader.onload = function () {
          props.setFieldValue(
            "image_url",
            reader.result
          );
        };
      }
    }
  }

  exportCsv = async () => {
    const { authToken, user } = this.props;
    const { searchValue, status } = this.state;
    var statusF = status === 0 || status === 1 ? status : "";
    var search = (searchValue !== undefined) ? searchValue : "";
    var conditions = { statusF, search };
    let data = { conditions: JSON.stringify(conditions), type: "CUSTOM", report_type: "outlet_data", req_user_id: user.id };

    await createCSVRequest(authToken, data).then(result => {
      toast.success(result.data.message, {
        className: "green-css"
      });

    }).catch(errors => {
      var msg = errors.response ? errors.response.data.message : errors.message;
      toast.error(msg, {
        className: "red-css"
      });
    });
  }

  onImportXlsxChange = (file) => {
    this.setState({ importXlsxArr: file });
  }

  importXlsxFile = async () => {
    this.setState({ scriptImporting: true });
    const { authToken } = this.props;
    const data = new FormData();

    data.append('file', this.state.importXlsxArr[0]);
    await importOutlet(authToken, data).then((result) => {
      this.handleClose();
      toast.success(result.data.message, {
        className: "green-css"
      });
      this.handleModal("ScriptProcessing");
      let interval = setInterval(async () => {
        let data = { report_detail_id: result.data.report_detail_id }
        await importScriptStatus(authToken, data).then((res) => {
          this.setState({ scriptImporting: false });
          
          // this.handleClose();
          clearInterval(interval);
          window.location.reload();
        })
      }, 10000);
    }).catch((errors) => {
      var msg = errors.response
        ? errors.response.data.message
        : errors.message;
      toast.error(msg, {
        className: "red-css",
      });
    })
  }

  renderModalBody = () => {
    const {
      isFocus,
      modalType,
      currentOutlet,
      disabledBtn,
      activeTab,
      status,
      activeTabs,
      outlet,
      address,
      importXlsxArr,
      randomNumber
    } = this.state;
    console.log("In moDal : ", randomNumber)
    const customStyle = isFocus
      ? {
        borderRadius: 0,
        borderWidth: 2,
        backgroundColor: "transparent",
        borderColor: "#E3E3E3",
        color: "black",
      }
      : {
        borderRadius: 0,
        borderWidth: 2,
        backgroundColor: "transparent",
        color: "black",
      };
    const handlePreviewIcon = (fileObject, classes) => {
      const fileTypes = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
      const { type } = fileObject.file;
      const iconProps = {
        className: classes.image,
      };

      if (type.startsWith("video/")) return <OndemandVideo {...iconProps} />;
      if (type.startsWith("image/"))
        return (
          <img
            className={classes.previewImg}
            role="presentation"
            src={fileObject.data}
          />
        );
      if (type === "application/pdf") return <PictureAsPdf {...iconProps} />;
      if (fileTypes.includes(type)) return <NoteAdd {...iconProps} />;
    };
    const isEdit = modalType === "Edit" ? true : false;

    if (modalType === "ActiveStatus") {
      return (
        <div>
          <Modal.Header closeButton style={{ padding: "0px 0px 0px 20px" }}>
            <Modal.Title style={{ fontWeight: 700 }} className="text-dark">
              Change Outlet Status
            </Modal.Title>
          </Modal.Header>
          <hr style={{ borderWidth: 2 }} />
          <Form noValidate>
            <Modal.Body>
              <Form.Group as={Col} md="12" className={"text-center"}>
                <Form.Label style={{ fontWeight: 400 }} className="text-muted">
                  Are you sure you want to{" "}
                  {currentOutlet.status === 0 ? (
                    <b>Activate </b>
                  ) : (
                    <b>Deactivate </b>
                  )}
                  this outlet with{" "}
                  <b>{currentOutlet && currentOutlet.outlet_name}</b> ?
                </Form.Label>
              </Form.Group>
            </Modal.Body>
            <hr className="line-style" />
            <Modal.Footer>
              {currentOutlet.status === 0 ? (
                <Button
                  className="ml-auto mr-3 w-auto"
                  variant="success"
                  disabled={disabledBtn}
                  onClick={(e) => this.handleSwitchChange(e)}
                >
                  Activate
                </Button>
              ) : (
                <Button
                  className="ml-auto mr-3 w-auto"
                  variant="danger"
                  disabled={disabledBtn}
                  onClick={(e) => this.handleSwitchChange(e)}
                >
                  Deactivate
                </Button>
              )}
            </Modal.Footer>
          </Form>
        </div>
      );
    } else if (modalType === "Add" || modalType === "Edit") {
      return (
        <div>
          <Modal.Header closeButton style={{ padding: "30px 20px 0px 20px" }}>
            <div className={"row align-items-center"}>
              <div
                className={
                  activeTabs === 0
                    ? "col-auto text-center tab-text modal-tab-active"
                    : "col-auto text-center tab-text"
                }
              >
                Basic
              </div>
              <div
                className={
                  activeTabs === 1
                    ? "col-auto text-center tab-text modal-tab-active"
                    : "col-auto text-center tab-text"
                }
              >
                Coverage
              </div>
              <div
                className={
                  activeTabs === 2
                    ? "col-auto text-center tab-text modal-tab-active"
                    : "col-auto text-center tab-text"
                }
              >
                Owner
              </div>
              <div
                className={
                  activeTabs === 3
                    ? "col-auto text-center tab-text modal-tab-active"
                    : "col-auto text-center tab-text"
                }
              >
                Person
              </div>
              <div
                className={
                  activeTabs === 4
                    ? "col-auto text-center tab-text modal-tab-active"
                    : "col-auto text-center tab-text"
                }
              >
                Account Information
              </div>
            </div>
          </Modal.Header>
          <hr style={{ borderWidth: 2 }} />
          {activeTabs === 0 ? (
            <div
              className={"tab-pane show active"}
              id="kt_user_edit_tab_1"
              role="tabpanel"
            >
              <Formik
                validate={(values) => {
                  const errors = {};

                  var i = this.state.outletName.map((item) => {
                    if (isEdit && currentOutlet.outlet_name != values.outlet_name) {
                      return item.outlet_name.toLowerCase() == values.outlet_name.toLowerCase();
                    } else if (!isEdit) {
                      return item.outlet_name.toLowerCase() == values.outlet_name.toLowerCase();
                    }
                  });

                  if (values.outlet_name.trim().length <= 0) {
                    errors.outlet_name = "Please provide valid outlet name";
                  } else if (i.includes(true)) {
                    errors.outlet_name = "This name is already exist please select another name";
                  }

                  if (values.outlet_email.length <= 0) {
                    errors.outlet_email = "Please provide valid email";
                  } else if (
                    !/^[0-9a-zA-Z]{1}[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                      values.outlet_email
                    )
                  ) {
                    errors.outlet_email = "Please provide valid email";
                  }

                  if (values.outlet_contact.length < 8) {
                    errors.outlet_contact =
                      "Please enter atleast 8 to 12 digit number";
                  } else if (values.outlet_contact.length > 12) {
                    errors.outlet_contact =
                      "Please enter atleast 8 to 12 digit number";
                  }

                  if (values.address.length <= 0) {
                    errors.address = "Please provide valid address";
                  }

                  if (values.postal_code.length <= 0) {
                    errors.postal_code = "Please provide valid postal code";
                  }

                  if (values.city.length <= 0) {
                    errors.city = "Please provide valid city";
                  }

                  if (values.state.length <= 0) {
                    errors.state = "Please provide valid state";
                  }

                  return errors;
                }}
                enableReinitialize
                onSubmit={(values, { setStatus, setSubmitting }) => {
                  var arr = [];
                  // if(values?.outlet_url?.name != outlet?.outlet_url?.name) {
                  arr.push(values)
                  // }else{
                  // arr.push({ outlet_url: outlet.outlet_url, ...values });
                  // }

                  var d = this.state.outlet.map((item, i) =>
                    Object.assign({}, item, arr[i])
                  );

                  this.setState({
                    outlet: d,
                    activeTabs: activeTabs + 1,
                  });
                }}
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={{
                  outlet_url: outlet?.length > 0 ? outlet?.[0]?.outlet_url ? outlet?.[0]?.outlet_url : null : null,
                  outlet_name: outlet?.length > 0 ? outlet?.[0]?.outlet_name ? outlet?.[0]?.outlet_name : "" : "",
                  outlet_email: outlet?.length > 0 ? outlet?.[0]?.outlet_email ? outlet?.[0]?.outlet_email : "" : "",
                  outlet_contact: outlet?.length > 0 ? outlet?.[0]?.outlet_contact ? outlet?.[0]?.outlet_contact : "" : "",
                  address: outlet?.length > 0 ? outlet?.[0]?.address ? outlet?.[0]?.address : "" : "",
                  postal_code: outlet?.length > 0 ? outlet?.[0]?.postal_code ? outlet?.[0]?.postal_code : "" : "",
                  city: outlet?.length > 0 ? outlet?.[0]?.city ? outlet?.[0]?.city : "" : "",
                  state: outlet?.length > 0 ? outlet?.[0]?.state ? outlet?.[0]?.state : "" : "",
                  image_url: outlet?.length > 0 ? outlet?.[0]?.image_url ? outlet?.[0]?.image_url : null : null,
                }}
              >
                {({
                  handleSubmit,
                  handleChange,
                  values,
                  errors,
                  status,
                  touched,
                  isSubmitting,
                  ...props
                }) => (
                  <Form noValidate={true} onSubmit={handleSubmit}>
                    <Modal.Body className="row pt-0">
                      <div className="fv-row mt-3 col-lg-6">
                        <label className="form-label mb-0 fw-600 text-dark">
                          BASIC INFO
                        </label>
                        <input
                          required
                          placeholder="Enter Name"
                          className={clsx(
                            "form-control form-control-solid",
                            {
                              "is-invalid":
                                touched.outlet_name && errors.outlet_name,
                            },
                            {
                              "is-valid":
                                touched.outlet_name && !errors.outlet_name,
                            }
                          )}
                          type="text"
                          name="outlet_name"
                          autoComplete="off"
                          onFocus={() => this.changeFocus()}
                          onChange={(e) => {
                            props.setFieldValue("outlet_name", e.target.value);
                            this.updateState(e, "outlet_name");
                          }}
                          value={
                            values.outlet_name || outlet?.[0]?.outlet_name || ""
                          }
                        />
                        {touched.outlet_name && errors.outlet_name && (
                          <div classoutlet_name="fv-plugins-message-container">
                            <span role="alert">{errors.outlet_name}</span>
                          </div>
                        )}
                        <input
                          required
                          placeholder="Enter Email"
                          className={clsx(
                            "form-control form-control-solid mt-2",
                            {
                              "is-invalid":
                                touched.outlet_email && errors.outlet_email,
                            },
                            {
                              "is-valid":
                                touched.outlet_email && !errors.outlet_email,
                            }
                          )}
                          type="email"
                          name="outlet_email"
                          autoComplete="off"
                          onFocus={() => this.changeFocus()}
                          onChange={(e) => {
                            props.setFieldValue("outlet_email", e.target.value);
                            this.updateState(e, "outlet_email");
                          }}
                          value={values.outlet_email || ""}
                        />
                        {touched.outlet_email && errors.outlet_email && (
                          <div className="fv-plugins-message-container">
                            <span role="alert">{errors.outlet_email}</span>
                          </div>
                        )}
                        <input
                          required
                          placeholder="Enter Contact Number"
                          className={clsx(
                            "form-control form-control-solid mt-2",
                            {
                              "is-invalid":
                                touched.outlet_contact && errors.outlet_contact,
                            },
                            {
                              "is-valid":
                                touched.outlet_contact &&
                                !errors.outlet_contact,
                            }
                          )}
                          type="number"
                          name="outlet_contact"
                          autoComplete="off"
                          onKeyDown={(e) => this.preventFloat(e)}
                          onFocus={() => this.changeFocus()}
                          onChange={(e) => {
                            props.setFieldValue(
                              "outlet_contact",
                              e.target.value
                            );
                            this.updateState(e, "outlet_contact");
                          }}
                          value={values.outlet_contact || ""}
                        />
                        {touched.outlet_contact && errors.outlet_contact && (
                          <div className="fv-plugins-message-container">
                            <span role="alert">{errors.outlet_contact}</span>
                          </div>
                        )}
                        <label className="form-label mt-4 fw-600 text-dark">
                          OUTLET IMAGE
                        </label>
                        <DropzoneArea
                          dropzoneText={isEdit ? "Drag and Drop image here to replace your existing thumbnail" : "Drag and drop a image here or click"}
                          dropzoneClass={
                            status
                              ? "dropzone dropzone-default min-drop p-2 custom-border"
                              : "dropzone dropzone-default min-drop p-2"
                          }
                          dropzoneParagraphClass={
                            status
                              ? "dropzone-msg-title custom-border"
                              : "dropzone-msg-title"
                          }
                          acceptedFiles={["image/*"]}
                          filesLimit={1}
                          getPreviewIcon={handlePreviewIcon}
                          showAlerts={["error"]}
                          onDrop={(files) => this.onImageHandle(props, files)}
                          initialFiles={[values.image_url]}
                        />
                      </div>
                      <div className="fv-row mt-3 col-lg-6">
                        <label className="form-label mb-0 fw-600 text-dark">
                          OUTLET LOCATION
                        </label>
                        <p
                          className="cursor-pointer text-primary"
                          onClick={() => {
                            this.getCurrentLocation();
                          }}
                        >
                          <u>Get Location</u>
                        </p>

                        <label className="form-label mt-2 fw-600 text-dark">
                          ADDRESS DETAILS
                        </label>
                        <input
                          required
                          placeholder="Enter Address"
                          className={clsx(
                            "form-control form-control-solid",
                            { "is-invalid": touched.address && errors.address },
                            {
                              "is-valid": touched.address && !errors.address,
                            }
                          )}
                          type="text"
                          name="address"
                          autoComplete="off"
                          onFocus={() => this.changeFocus()}
                          onChange={handleChange}
                          value={values.address || ""}
                        />
                        {touched.address && errors.address && (
                          <div className="fv-plugins-message-container">
                            <span role="alert">{errors.address}</span>
                          </div>
                        )}
                        <input
                          required
                          placeholder="Enter Postal Code"
                          className={clsx(
                            "form-control form-control-solid mt-2",
                            {
                              "is-invalid":
                                touched.postal_code && errors.postal_code,
                            },
                            {
                              "is-valid":
                                touched.postal_code && !errors.postal_code,
                            }
                          )}
                          type="number"
                          name="postal_code"
                          autoComplete="off"
                          onFocus={() => this.changeFocus()}
                          onChange={handleChange}
                          value={values.postal_code || ""}
                        />
                        {touched.postal_code && errors.postal_code && (
                          <div className="fv-plugins-message-container">
                            <span role="alert">{errors.postal_code}</span>
                          </div>
                        )}
                        <input
                          required
                          placeholder="City"
                          className={clsx(
                            "form-control form-control-solid mt-2",
                            { "is-invalid": touched.city && errors.city },
                            {
                              "is-valid": touched.city && !errors.city,
                            }
                          )}
                          type="text"
                          name="city"
                          autoComplete="off"
                          onFocus={() => this.changeFocus()}
                          onChange={handleChange}
                          value={values.city || ""}
                        />
                        {touched.city && errors.city && (
                          <div className="fv-plugins-message-container">
                            <span role="alert">{errors.city}</span>
                          </div>
                        )}
                        <input
                          required
                          placeholder="State"
                          className={clsx(
                            "form-control form-control-solid mt-2",
                            { "is-invalid": touched.state && errors.state },
                            {
                              "is-valid": touched.state && !errors.state,
                            }
                          )}
                          type="text"
                          name="state"
                          autoComplete="off"
                          onFocus={() => this.changeFocus()}
                          onChange={handleChange}
                          value={values.state || ""}
                        />
                        {touched.state && errors.state && (
                          <div className="fv-plugins-message-container">
                            <span role="alert">{errors.state}</span>
                          </div>
                        )}
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        type="submit"
                        className="ml-auto mr-3"
                        variant="primary"
                      >
                        next
                      </Button>
                    </Modal.Footer>
                  </Form>
                )}
              </Formik>
            </div>
          ) : activeTabs === 1 ? (
            <div
              className={"tab-pane show active"}
              id="kt_user_edit_tab_1"
              role="tabpanel"
            >
              <Formik
                validate={(values) => {
                  const errors = {};

                  if (values.days.length > 0) {
                    var result = values.days.filter((obj) => {
                      // var start = obj?.start_time;
                      // var end = obj?.end_time;
                      // var st = minFromMidnight(start);
                      // var et = minFromMidnight(end);
                      // if (st > et) {
                      //     alert("End time must be greater than start time");
                      // } else {
                      return (
                        obj.checked ===
                        true /*&& obj?.start_time?.trim().length > 0 && obj?.end_time?.trim().length > 0 */
                      );
                      // }

                      // function minFromMidnight(tm) {
                      //     var ampm = tm.substr(-2)
                      //     var clk = tm.substr(0, 5);
                      //     var m = parseInt(clk.match(/\d+$/)[0], 10);
                      //     var h = parseInt(clk.match(/^\d+/)[0], 10);
                      //     h += (ampm.match(/pm/i)) ? 12 : 0;
                      //     return h * 60 + m;
                      // }
                    });
                    if (result.length <= 0) {
                      errors.days =
                        "Please select atleast one day";
                    }
                  }

                  return errors;
                }}
                enableReinitialize
                onSubmit={(values, { setStatus, setSubmitting }) => {
                  var arr = [];
                  arr.push(values);

                  var d = this.state.outlet.map((item, i) =>
                    Object.assign({}, item, arr[i])
                  );

                  this.setState({
                    outlet: d,
                    activeTabs: activeTabs + 1,
                  });
                }}
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={{
                  days: [
                    {
                      outlet_open_id: outlet
                        ? outlet?.[0]?.days?.[0]?.outlet_open_id
                        : "",
                      name: "sunday",
                      checked: outlet ? outlet?.[0]?.days?.[0]?.checked : false,
                      // start_time: outlet ? outlet?.[0]?.days?.[0]?.start_time : '',
                      // start: outlet ? outlet?.[0]?.days?.[0]?.start : '',
                      // end_time: outlet ? outlet?.[0]?.days?.[0]?.end_time : '',
                      // end: outlet ? outlet?.[0]?.days?.[0]?.end : '',
                    },
                    {
                      outlet_open_id: outlet
                        ? outlet?.[0]?.days?.[1]?.outlet_open_id
                        : "",
                      name: "tuesday",
                      checked: outlet ? outlet?.[0]?.days?.[1]?.checked : false,
                      // start_time: outlet ? outlet?.[0]?.days?.[1]?.start_time : '',
                      // start: outlet ? outlet?.[0]?.days?.[1]?.start : '',
                      // end_time: outlet ? outlet?.[0]?.days?.[1]?.end_time : '',
                      // end: outlet ? outlet?.[0]?.days?.[1]?.end : '',
                    },
                    {
                      outlet_open_id: outlet
                        ? outlet?.[0]?.days?.[2]?.outlet_open_id
                        : "",
                      name: "wednesday",
                      checked: outlet ? outlet?.[0]?.days?.[2]?.checked : false,
                      // start_time: outlet ? outlet?.[0]?.days?.[2]?.start_time : '',
                      // start: outlet ? outlet?.[0]?.days?.[2]?.start : '',
                      // end_time: outlet ? outlet?.[0]?.days?.[2]?.end_time : '',
                      // end: outlet ? outlet?.[0]?.days?.[2]?.end : '',
                    },
                    {
                      outlet_open_id: outlet
                        ? outlet?.[0]?.days?.[3]?.outlet_open_id
                        : "",
                      name: "thursday",
                      checked: outlet ? outlet?.[0]?.days?.[3]?.checked : false,
                      // start_time: outlet ? outlet?.[0]?.days?.[3]?.start_time : '',
                      // start: outlet ? outlet?.[0]?.days?.[3]?.start : '',
                      // end_time: outlet ? outlet?.[0]?.days?.[3]?.end_time : '',
                      // end: outlet ? outlet?.[0]?.days?.[3]?.end : '',
                    },
                    {
                      outlet_open_id: outlet
                        ? outlet?.[0]?.days?.[4]?.outlet_open_id
                        : "",
                      name: "friday",
                      checked: outlet ? outlet?.[0]?.days?.[4]?.checked : false,
                      // start_time: outlet ? outlet?.[0]?.days?.[4]?.start_time : '',
                      // start: outlet ? outlet?.[0]?.days?.[4]?.start : '',
                      // end_time: outlet ? outlet?.[0]?.days?.[4]?.end_time : '',
                      // end: outlet ? outlet?.[0]?.days?.[4]?.end : '',
                    },
                    {
                      outlet_open_id: outlet
                        ? outlet?.[0]?.days?.[5]?.outlet_open_id
                        : "",
                      name: "saturday",
                      checked: outlet ? outlet?.[0]?.days?.[5]?.checked : false,
                      // start_time: outlet ? outlet?.[0]?.days?.[5]?.start_time : '',
                      // start: outlet ? outlet?.[0]?.days?.[5]?.start : '',
                      // end_time: outlet ? outlet?.[0]?.days?.[5]?.end_time : '',
                      // end: outlet ? outlet?.[0]?.days?.[5]?.end : '',
                    },
                  ],
                }}
              >
                {({
                  handleSubmit,
                  handleChange,
                  values,
                  errors,
                  status,
                  touched,
                  isSubmitting,
                  ...props
                }) => (
                  <Form noValidate={true} onSubmit={handleSubmit}>
                    <Modal.Body className="pt-0">
                      {values.days?.map((item, index) => {
                        return (
                          <div
                            className="d-flex align-items-center justify-content-between mt-2"
                            key={index}
                          >
                            <div className="form-check m-0">
                              <input
                                type="checkbox"
                                onChange={(e) => {
                                  var dup = values.days;
                                  dup[index].checked = e.target.checked;
                                  props.setFieldValue("days", dup);
                                }}
                                id={item.name}
                                name={item.name}
                                checked={item.checked}
                                className={"form-check-input mt-2"}
                              />
                              <label
                                className="form-check-label text-black"
                                htmlFor={item.name}
                              >
                                {item.name}
                              </label>
                            </div>

                            {/* {item.checked == true && <div className="d-flex align-items-center">
                                                                <div className='d-flex align-items-center'>
                                                                    <label className="text-black text-nowrap mb-0">Start Time</label>
                                                                    <input
                                                                        type="time"
                                                                        name="start_time"
                                                                        className="ml-3 form-control"
                                                                        value={item.start_time || ""}
                                                                        onChange={(e) => {
                                                                            var dup = values.days;
                                                                            dup[index].start_time = e.target.value;
                                                                            dup[index].start = moment(e.target.value, "hh:mm").format('LT');
                                                                            props.setFieldValue("days", dup);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className='ml-4 d-flex align-items-center'>
                                                                    <label className="text-black text-nowrap mb-0">End Time</label>
                                                                    <input
                                                                        type="time"
                                                                        min={item.start_time}
                                                                        name="end_time"
                                                                        className="ml-3 form-control"
                                                                        value={item.end_time || ""}
                                                                        onChange={(e) => {
                                                                            var dup = values.days;
                                                                            dup[index].end_time = e.target.value;
                                                                            dup[index].end = moment(e.target.value, "hh:mm").format('LT');
                                                                            props.setFieldValue("days", dup);

                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            } */}
                          </div>
                        );
                      })}
                      {Boolean(errors.days) && (
                        <div className="fv-plugins-message-container">
                          <span role="alert">{errors.days}</span>
                        </div>
                      )}
                    </Modal.Body>
                    <Modal.Footer>
                      <a
                        type="btn btn-dark"
                        className="ml-auto mr-3"
                        onClick={() => this.handleActiveTabs(0)}
                      >
                        Back
                      </a>
                      <Button type="submit" variant="primary">
                        next
                      </Button>
                    </Modal.Footer>
                  </Form>
                )}
              </Formik>
            </div>
          ) : activeTabs === 2 ? (
            <div
              className={"tab-pane show active"}
              id="kt_user_edit_tab_1"
              role="tabpanel"
            >
              <Formik
                validate={(values) => {
                  const errors = {};

                  if (values.owner_email != "") {
                    if (
                      values.owner_email?.length > 0 &&
                      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                        values.owner_email
                      )
                    ) {
                      errors.owner_email = "Please provide valid email";
                    }
                  }

                  return errors;
                }}
                enableReinitialize
                onSubmit={(values, { setStatus, setSubmitting }) => {
                  var arr = [];
                  arr.push(values);
                  var d = this.state.outlet.map((item, i) =>
                    Object.assign({}, item, arr[i])
                  );

                  this.setState({
                    outlet: d,
                    activeTabs: activeTabs + 1,
                  });
                }}
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={{
                  owner_name: outlet ? outlet?.[0].owner_name : "",
                  owner_email: outlet ? outlet?.[0].owner_email : "",
                  owner_contact: outlet ? outlet?.[0].owner_contact : "",
                }}
              >
                {({
                  handleSubmit,
                  handleChange,
                  values,
                  errors,
                  status,
                  touched,
                  isSubmitting,
                  ...props
                }) => (
                  <Form noValidate={true} onSubmit={handleSubmit}>
                    <Modal.Body className="row pt-0">
                      <div className="fv-row mb-4 col-lg-6">
                        <label className="form-label mb-0 fw-600 text-dark">
                          OWNER CONTACT
                        </label>
                        <input
                          required
                          placeholder="Enter Name"
                          className={"form-control form-control-solid"}
                          type="text"
                          name="owner_name"
                          autoComplete="off"
                          onFocus={() => this.changeFocus()}
                          onChange={handleChange}
                          value={values.owner_name || ""}
                        />
                        <input
                          required
                          placeholder="Enter Email"
                          className={clsx(
                            "form-control form-control-solid mt-2",
                            {
                              "is-invalid":
                                touched.owner_email && errors.owner_email,
                            },
                            {
                              "is-valid":
                                touched.owner_email && !errors.owner_email,
                            }
                          )}
                          type="email"
                          name="owner_email"
                          autoComplete="off"
                          onFocus={() => this.changeFocus()}
                          onChange={handleChange}
                          value={values.owner_email || ""}
                        />
                        {touched.owner_email && errors.owner_email && (
                          <div className="fv-plugins-message-container">
                            <span role="alert">{errors.owner_email}</span>
                          </div>
                        )}
                        <input
                          required
                          placeholder="Enter Contact Number"
                          className={"form-control form-control-solid mt-2"}
                          type="number"
                          name="owner_contact"
                          autoComplete="off"
                          onKeyDown={(e) => this.preventFloat(e)}
                          onFocus={() => this.changeFocus()}
                          onChange={handleChange}
                          value={values.owner_contact || ""}
                        />
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <a
                        type="btn btn-dark"
                        className="ml-auto mr-3"
                        onClick={() => this.handleActiveTabs(1)}
                      >
                        Back
                      </a>
                      <Button type="submit" className="mr-3" variant="primary">
                        Next
                      </Button>
                    </Modal.Footer>
                  </Form>
                )}
              </Formik>
            </div>
          ) : activeTabs === 3 ? (
            <div
              className={"tab-pane show active"}
              id="kt_user_edit_tab_1"
              role="tabpanel"
            >
              <Formik
                validate={(values) => {
                  const errors = {};

                  if (values.person_email != "") {
                    if (
                      values.person_email?.length > 0 &&
                      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                        values.person_email
                      )
                    ) {
                      errors.person_email = "Please provide valid email";
                    }
                  }

                  return errors;
                }}
                enableReinitialize
                onSubmit={(values, { setStatus, setSubmitting }) => {
                  var arr = [];
                  arr.push(values);
                  var d = this.state.outlet.map((item, i) =>
                    Object.assign({}, item, arr[i])
                  );

                  this.setState({
                    outlet: d,
                    activeTabs: activeTabs + 1,
                  });
                }}
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={{
                  person_name: outlet ? outlet?.[0].person_name : "",
                  person_email: outlet ? outlet?.[0].person_email : "",
                  person_contact: outlet ? outlet?.[0].person_contact : "",
                }}
              >
                {({
                  handleSubmit,
                  handleChange,
                  values,
                  errors,
                  status,
                  touched,
                  isSubmitting,
                  ...props
                }) => (
                  <Form noValidate={true} onSubmit={handleSubmit}>
                    <Modal.Body className="row pt-0">
                      <div className="fv-row mb-4 col-lg-6">
                        <label className="form-label mb-0 fw-600 text-dark">
                          PERSON INCHARGE
                        </label>
                        <input
                          required
                          placeholder="Enter Name"
                          className={"form-control form-control-solid"}
                          type="text"
                          name="person_name"
                          autoComplete="off"
                          onFocus={() => this.changeFocus()}
                          onChange={handleChange}
                          value={values.person_name || ""}
                        />
                        <input
                          required
                          placeholder="Enter Email"
                          className={clsx(
                            "form-control form-control-solid mt-2",
                            {
                              "is-invalid":
                                touched.person_email && errors.person_email,
                            },
                            {
                              "is-valid":
                                touched.person_email && !errors.person_email && values.person_email,
                            }
                          )}
                          type="email"
                          name="person_email"
                          autoComplete="off"
                          onFocus={() => this.changeFocus()}
                          onChange={handleChange}
                          value={values.person_email || ""}
                        />
                        {touched.person_email && errors.person_email && (
                          <div className="fv-plugins-message-container">
                            <span role="alert">{errors.person_email}</span>
                          </div>
                        )}
                        <input
                          required
                          placeholder="Enter Contact Number"
                          className={"form-control form-control-solid mt-2"}
                          type="number"
                          name="person_contact"
                          autoComplete="off"
                          onKeyDown={(e) => this.preventFloat(e)}
                          onFocus={() => this.changeFocus()}
                          onChange={handleChange}
                          value={values.person_contact || ""}
                        />
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <a
                        type="btn btn-dark"
                        className="ml-auto mr-3"
                        onClick={() => this.handleActiveTabs(2)}
                      >
                        Back
                      </a>
                      <Button type="submit" className="mr-3" variant="primary">
                        Next
                      </Button>
                    </Modal.Footer>
                  </Form>
                )}
              </Formik>
            </div>
          ) : (
            <div
              className={"tab-pane show active"}
              id="kt_user_edit_tab_1"
              role="tabpanel"
            >
              <Formik
                validate={(values) => {
                  const errors = {};
                  if (!values.jti_acc || values.jti_acc.length <= 0) {
                    errors.jti_acc = "Please provide valid jti_acc";
                  }
                  if (!values.acc || values.acc.length <= 0) {
                    errors.acc = "Please provide valid acc";
                  }
                  if (!values.type || values.type === "Select Type") {
                    errors.type = "Please select valid type";
                  }

                  return errors;
                }}
                enableReinitialize
                onSubmit={(values, { setStatus, setSubmitting }) => {
                  var arr = [];
                  arr.push(values);
                  var d = this.state.outlet.map((item, i) =>
                    Object.assign({}, item, arr[i])
                  );

                  this.setState({
                    outlet: d,
                  });

                  if (isEdit) {
                    this.handleEditSubmit(d, setSubmitting);
                  } else {
                    this.handleAddSubmit(d, setSubmitting);
                  }
                }}
                validateOnChange={false}
                validateOnBlur={false}
                initialValues={{
                  jti_acc: outlet ? outlet?.[0].jti_acc : "",
                  acc: outlet ? modalType === "Add" ? randomNumber : outlet?.[0].acc : "",
                  type: outlet ? outlet?.[0].type : "",
                }}
              >
                {({
                  handleSubmit,
                  handleChange,
                  values,
                  errors,
                  status,
                  touched,
                  isSubmitting,
                  ...props
                }) => (
                  <Form noValidate={true} onSubmit={handleSubmit}>
                    <Modal.Body className="row pt-0">
                      <div className="fv-row mb-4 col-lg-6">
                        <label className="form-label mb-0 fw-600 text-dark">
                          ACCOUNT INFORMATION
                        </label>
                        <input
                          required
                          placeholder="Enter JTI ACC"
                          // className={"form-control form-control-solid"}
                          className={clsx(
                            "form-control form-control-solid",
                            { "is-invalid": touched.jti_acc && errors.jti_acc },
                            {
                              "is-valid": touched.jti_acc && !errors.jti_acc,
                            }
                          )}
                          type="number"
                          name="jti_acc"
                          autoComplete="off"
                          onFocus={() => this.changeFocus()}
                          onChange={handleChange}
                          value={values.jti_acc || ""}
                        />
                        {touched.jti_acc && errors.jti_acc && (
                          <div className="fv-plugins-message-container">
                            <span role="alert">{errors.jti_acc}</span>
                          </div>
                        )}
                        <input
                          required
                          placeholder="Enter ACC"
                          className={clsx(
                            "form-control form-control-solid mt-2",
                            { "is-invalid": touched.acc && errors.acc },
                            {
                              "is-valid": touched.acc && !errors.acc,
                            }
                          )}
                          type="string"
                          name="acc"
                          autoComplete="off"
                          onFocus={() => this.changeFocus()}
                          onChange={handleChange}
                          value={values.acc || ""}
                          disabled={true}
                        />
                        {touched.acc && errors.acc && (
                          <div className="fv-plugins-message-container">
                            <span role="alert">{errors.acc}</span>
                          </div>
                        )}

                        <select
                          className={clsx(
                            'form-control mt-2',
                            { 'is-invalid': touched.type && errors.type },
                            {
                              'is-valid': touched.type && !errors.type,
                            }
                          )}
                          type={"text"}
                          name={"type"}
                          value={values.type}
                          onChange={handleChange}
                        >
                          <option>Select Type</option>
                          <option value={"NEO"} >NEO</option>
                          <option value={"GT"}>GT</option>
                        </select>
                        {touched.type && errors.type && (
                          <div className='fv-plugins-message-container'>
                            <span role='alert'>{errors.type}</span>
                          </div>
                        )}
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <a
                        type="btn btn-dark"
                        className="ml-auto mr-3"
                        onClick={() => this.handleActiveTabs(3)}
                      >
                        Back
                      </a>
                      <Button
                        type="submit"
                        className="mr-3"
                        variant="primary"
                        disabled={isSubmitting}
                      >
                        {isEdit ? "Update" : "Submit"}
                      </Button>
                    </Modal.Footer>
                  </Form>
                )}
              </Formik>
            </div>
          )}
        </div>
      );
    } else if (modalType === "Delete") {
      return (
        <div>
          <Modal.Header closeButton style={{ padding: "0px 0px 0px 20px" }}>
            <Modal.Title style={{ fontWeight: 700 }}>Delete Outlet</Modal.Title>
          </Modal.Header>
          <hr style={{ borderWidth: 2 }} />
          <Form noValidate>
            <Modal.Body>
              <Form.Group as={Col} md="12" className={"text-center"}>
                <Form.Label style={{ fontWeight: 400 }}>
                  Are you sure you want to delete this outlet with{" "}
                  <b>{currentOutlet && currentOutlet.outlet_name}</b> ?
                </Form.Label>
              </Form.Group>
            </Modal.Body>
            <hr className="line-style" />
            <Modal.Footer>
              <Button
                className="ml-auto mr-3 w-auto"
                variant="danger"
                disabled={disabledBtn}
                onClick={(e) => this.handleDelete(e)}
              >
                Delete
              </Button>
            </Modal.Footer>
          </Form>
        </div>
      );
    } else if (modalType === "importXLSX") {
      return (
        <div>
          <Modal.Header closeButton style={{ padding: "0px 0px 0px 20px" }}>
            <Modal.Title style={{ fontWeight: 700 }}>Import XLSX</Modal.Title>
          </Modal.Header>
          <hr style={{ borderWidth: 2 }} />
          <Form noValidate>
            <Modal.Body className="p-5">
              <DropzoneArea
                dropzoneText={"Drag and drop a XLSX file here or click"}
                dropzoneClass={"dropzone dropzone-default min-drop p-2"
                }
                dropzoneParagraphClass={"dropzone-msg-title"
                }
                acceptedFiles={["application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]}
                filesLimit={1}
                onChange={(files) => this.onImportXlsxChange(files)}
                getPreviewIcon={handlePreviewIcon}
                showAlerts={["error"]}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                className="ml-auto mr-3 w-auto"
                variant="primary"
                disabled={importXlsxArr.length > 0 ? false : true}
                onClick={(e) => this.importXlsxFile()}
              >
                Import
              </Button>
            </Modal.Footer>
          </Form>
        </div>
      );
    } else if (modalType === "ScriptProcessing") {
      return (
        <div>
          <Modal.Header style={{ padding: "0px 0px 0px 20px" }}>
            <Modal.Title style={{ fontWeight: 700 }}>File Importing</Modal.Title>
          </Modal.Header>
          <hr style={{ borderWidth: 2 }} />
          <Form noValidate>
            <Modal.Body>
              <Form.Group as={Col} md="12" className={"text-center"}>
                <Form.Label style={{ fontWeight: 400 }}>
                  <h2 className="text-black">Your file is being processing..</h2>
                  <h5 className="mt-4">Please don't reload or exit the window.</h5>
                </Form.Label>
              </Form.Group>
            </Modal.Body>
          </Form>
        </div>
      );
    } 
  };

  handleActiveTabs = (value) => {
    this.setState({
      activeTabs: value,
    });
  };

  render() {
    const {
      outletData,
      outletCount,
      activePage,
      limit,
      searchValue,
      loading,
      isFocus,
      startDate,
      endDate,
      scriptImporting
    } = this.state;
    const customStyle = isFocus ? styleSearch : { borderWidth: 2 };
    const modalStyle = scriptImporting ? {backdrop: 'static', keyboard: false} : {opacity: 1}

    return (
      <div>
        <TitleComponent title={this.props.title} icon={this.props.icon} />
        {scriptImporting && (
          <Beforeunload onBeforeunload={(event) => event.preventDefault()} />
        )}

        <div className="row">
          <div className="col-md-12">
            <div className="kt-section bg-white px-4 py-2 border-top">
              <form
                className="kt-quick-search__form"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <div className="row">
                  <div className="input-group align-self-center col-9 col-md-3 mb-0">
                    <div className="input-group-prepend">
                      <span
                        className="input-group-text"
                        style={{ borderWidth: 2 }}
                      >
                        <i className="flaticon2-search-1" />
                      </span>
                    </div>

                    <input
                      type="text"
                      ref={this.inputRef}
                      placeholder="Search..."
                      value={searchValue}
                      onFocus={() => this.changeFocus()}
                      style={customStyle}
                      onChange={this.handleSearchChange}
                      className="form-control kt-quick-search__input h-auto"
                    />
                    {searchValue && (
                      <div className="input-group-append" onClick={this.clear}>
                        <span
                          className="input-group-text"
                          style={{ borderWidth: 2 }}
                        >
                          <i
                            className="la la-close kt-quick-search__close"
                            style={{ display: "flex" }}
                          />
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mr-md-3">
                    <Button
                      type="button"
                      className="btn btn-primary btn-elevate kt-login__btn-primary"
                      onClick={this.handleSubmit}
                    >
                      Search
                    </Button>
                  </div>
                  <div className="mr-3 ml-3 ml-md-0">
                    <Button
                      type="button"
                      className="btn btn-info btn-elevate kt-login__btn-info"
                      onClick={this.handleReset}
                    >
                      Reset
                    </Button>
                  </div>
                  <Dropdown drop="down">
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      Status
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => this.handleStatus(1)}>
                        Active
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => this.handleStatus(0)}>
                        Inactive
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => this.handleStatus(2)}>
                        All
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <div className="mr-2 ml-auto">
                    <Button
                      className="btn btn-primary btn-elevate kt-login__btn-warning"
                      onClick={(e) => {
                        e.preventDefault();
                        this.handleModal("Add");
                      }}
                    >
                      Add Outlet
                    </Button>
                    <Button
                      className="btn btn-success btn-elevate kt-login__btn-warning mx-2"
                      onClick={(e) => {
                        e.preventDefault();
                        this.exportCsv();
                      }}
                    >
                      Export
                    </Button>
                    <Button
                      className="btn btn-info btn-elevate kt-login__btn-warning"
                      onClick={(e) => {
                        e.preventDefault();
                        this.handleModal("importXLSX");
                      }}
                    >
                      Import
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <ToastContainer />
        <Portlet className={"shadow-none"}>
          <PortletBody>
            {loading ? (
              <div className="text-center py-3">
                <CircularProgress />
              </div>
            ) : (
              <Table
                striped
                responsive
                bordered
                hover
                className="table-list-header m-0"
              >
                <thead>
                  <tr>
                    <th>
                      <span className="pl-md-5">
                        <b>Outlet Name</b>
                      </span>
                      <i
                        className="flaticon2-up ml-2 ctriggerclick arrow-icons"
                        style={{ fontSize: 10 }}
                        onClick={() => this.handleSorting("outlet_name", "ASC")}
                      />
                      <i
                        className="flaticon2-down ctriggerclick arrow-icons"
                        style={{ fontSize: 10 }}
                        onClick={() =>
                          this.handleSorting("outlet_name", "DESC")
                        }
                      />
                    </th>
                    <th>
                      <span className="pl-md-5">
                        <b>Basic Info</b>
                      </span>
                      <i
                        className="flaticon2-up ml-2 ctriggerclick arrow-icons"
                        style={{ fontSize: 10 }}
                        onClick={() =>
                          this.handleSorting("outlet_email", "ASC")
                        }
                      />
                      <i
                        className="flaticon2-down ctriggerclick arrow-icons"
                        style={{ fontSize: 10 }}
                        onClick={() =>
                          this.handleSorting("outlet_email", "DESC")
                        }
                      />
                    </th>
                    <th>
                      <span className="pl-md-5">
                        <b>Address</b>
                      </span>
                      <i
                        className="flaticon2-up ml-2 ctriggerclick arrow-icons"
                        style={{ fontSize: 10 }}
                        onClick={() => this.handleSorting("address", "ASC")}
                      />
                      <i
                        className="flaticon2-down ctriggerclick arrow-icons"
                        style={{ fontSize: 10 }}
                        onClick={() => this.handleSorting("address", "DESC")}
                      />
                    </th>
                    <th>
                      <span className="pl-md-5">
                        <b>Coverage Days</b>
                      </span>
                    </th>
                    <th className="text-center">
                      <b>Status</b>
                    </th>
                    <th className="text-center">
                      <b>Actions</b>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {outletData.length > 0 ? (
                    outletData.map((item, index) => (
                      <tr key={item.id}>
                        <td>
                          <h6 className={"font-weight-bold text-muted pl-md-5"}>
                            {item.outlet_name}
                          </h6>
                        </td>
                        <td>
                          <h6 className={"font-weight-bold text-muted pl-md-5"}>
                            {item.outlet_email ? item.outlet_email : "-"}
                          </h6>
                          <h6 className={"font-weight-bold text-muted pl-md-5"}>
                            {item.outlet_contact ? item.outlet_contact : "-"}
                          </h6>
                        </td>
                        <td>
                          <h6 className={"font-weight-bold text-muted pl-md-5"}>
                            {item.address}
                          </h6>
                        </td>
                        <td>
                          <h6 className={"font-weight-bold text-muted pl-md-5"}>
                            {item.days.length > 0
                              ? item.days.map((it, indx) => {
                                return (
                                  <span key={indx}>
                                    {item.days.length - 1 == indx
                                      ? it.name
                                      : it.name + ", "}
                                  </span>
                                );
                              })
                              : "-"}
                          </h6>
                        </td>
                        <td className="text-center">
                          <h6
                            className={"font-weight-bold Status_activation"}
                            onClick={(e) => {
                              e.preventDefault();
                              this.handleModal("ActiveStatus", item);
                            }}
                          >
                            {item.status === 1 ? (
                              <span
                                className={
                                  "text-success border-bottom border-success"
                                }
                              >
                                Active
                              </span>
                            ) : (
                              <span
                                className={
                                  "text-danger border-bottom border-danger"
                                }
                              >
                                Deactive
                              </span>
                            )}
                          </h6>
                        </td>
                        <td className="text-center">
                          <OverlayTrigger
                            placement="left"
                            overlay={
                              <Tooltip id="documentations-tooltip">
                                Edit
                              </Tooltip>
                            }
                          >
                            <a
                              className="kt-menu__link-icon flaticon2-edit pr-4 text-warning"
                              style={{ fontSize: "1.3rem" }}
                              onClick={(e) => {
                                e.preventDefault();
                                this.handleModal("Edit", item);
                              }}
                            ></a>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="left"
                            overlay={
                              <Tooltip id="documentations-tooltip">
                                Delete
                              </Tooltip>
                            }
                          >
                            <a
                              className="kt-menu__link-icon flaticon2-rubbish-bin-delete-button text-danger"
                              style={{ fontSize: "1.3rem" }}
                              onClick={(e) => {
                                e.preventDefault();
                                this.handleModal("Delete", item);
                              }}
                            ></a>
                          </OverlayTrigger>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="12" className="text-center">
                        <div className="col-md-6 col-lg-4 mx-auto text-center mt-5">
                          <div className="card card-custom text-center py-5 border-doted-dark bg-transparent">
                            <div className="card-body">
                              <span className="bg-light-danger p-3 text-dark rounded">
                                <BrandingWatermark />
                              </span>
                              <h3 className="text-dark mb-0 mt-4">
                                No Outlets have been Found
                              </h3>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
          </PortletBody>
        </Portlet>

        {outletCount > limit && (
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center px-4 cus-pagination">
            <h5 className="text-dark mb-3 mb-md-0">
              {paginationTexts(activePage, outletCount, limit)}
            </h5>
            <Pagination
              bsSize={"medium"}
              activePage={activePage}
              itemsCountPerPage={limit}
              totalItemsCount={outletCount}
              pageRangeDisplayed={5}
              onChange={this.handleSelect}
              itemClass="page-item"
              linkClass="page-link"
            />
          </div>
        )}
        <Modal
          centered
          size={this.state.modalType == "Delete" ? "md" : "lg"}
          show={this.state.show}
          onHide={() => {
            this.handleClose();
          }}
          style={{ opacity: 1 }}
          backdrop={this.state.scriptImporting ? "static" : true}
        >
          {this.renderModalBody()}
        </Modal>
      </div>
    );
  }
}

const styleSearch = {
  borderColor: "#E3E3E3",
  borderWidth: 2,
  borderLeftWidth: 0,
  borderRightWidth: 0,
};

const mapStateToProps = ({ auth: { authToken, user } }) => ({
  authToken, user
});

export default connect(mapStateToProps)(Outlets);
