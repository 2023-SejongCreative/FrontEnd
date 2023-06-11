import React, { Component } from "react";
import { OpenVidu } from "openvidu-browser";
import { useParams } from "react-router-dom";

import {
  BsFillMicFill,
  BsFillMicMuteFill,
  BsCameraVideoFill,
  BsCameraVideoOffFill,
} from "react-icons/bs";

import UserVideoComponent from "./UserVideoComponent";
import { api } from "../../api/Interceptors";
import { InputTextInModal } from "../../components/commons/InputInModal";
import { BtnInModal, ButtonInModal } from "../../components/commons/BtnInModal";

function withParams(Component) {
  return (props) => <Component {...props} params={useParams()} />;
}

class VideoPage extends Component {
  constructor(props) {
    super(props);
    this.userRef = React.createRef(); //여기 추가
    const { dm_id } = this.props.params;
    console.log(dm_id);
    // These properties are in the state's component in order to re-render the HTML whenever their values change
    this.state = {
      mySessionId: "SessionA",
      myUserName: "OpenVidu_User_" + Math.floor(Math.random() * 100),
      session: undefined,
      mainStreamManager: undefined, // Main video of the page. Will be the 'publisher' or one of the 'subscribers'
      publisher: undefined,
      subscribers: [],
      response_session_id: "",

      //이 밑에 네줄 추가
      isMike: true,
      isCamera: true,
      isSpeaker: true,
      isChat: false,
    };

    this.joinSession = this.joinSession.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.switchCamera = this.switchCamera.bind(this);
    this.handleChangeSessionId = this.handleChangeSessionId.bind(this);
    this.handleChangeUserName = this.handleChangeUserName.bind(this);
    this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
    this.onbeforeunload = this.onbeforeunload.bind(this);
    // this.handleToggle = this.handleToggle.bind(this); //이부분 추가
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this.onbeforeunload);
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.onbeforeunload);
  }

  onbeforeunload(event) {
    this.leaveSession();
  }

  handleChangeSessionId(e) {
    this.setState({
      mySessionId: e.target.value,
    });
  }

  handleChangeUserName(e) {
    this.setState({
      myUserName: e.target.value,
    });
  }

  handleMainVideoStream(stream) {
    if (this.state.mainStreamManager !== stream) {
      this.setState({
        mainStreamManager: stream,
      });
    }
  }

  deleteSubscriber(streamManager) {
    let subscribers = this.state.subscribers;
    let index = subscribers.indexOf(streamManager, 0);
    if (index > -1) {
      subscribers.splice(index, 1);
      this.setState({
        subscribers: subscribers,
      });
    }
  }

  joinSession() {
    // --- 1) Get an OpenVidu object ---
    console.log("조인세션 함수실행!");
    const { dm_id } = this.props.params;
    console.log(dm_id);
    api
      .post("/chat/session/enter", { id: dm_id })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => console.log(err));

    this.OV = new OpenVidu();

    // --- 2) Init a session ---
    //이 부분 추가
    this.OV.setAdvancedConfiguration({
      publisherSpeakingEventsOptions: {
        interval: 50,
        threshold: -75,
      },
    });

    this.setState(
      {
        session: this.OV.initSession(),
      },
      () => {
        var mySession = this.state.session;

        // --- 3) Specify the actions when events take place in the session ---

        // On every new Stream received...
        mySession.on("streamCreated", (event) => {
          // Subscribe to the Stream to receive it. Second parameter is undefined
          // so OpenVidu doesn't create an HTML video by its own
          var subscriber = mySession.subscribe(event.stream, undefined);
          var subscribers = this.state.subscribers;
          subscribers.push(subscriber);

          // Update the state with the new subscribers
          this.setState({
            subscribers: subscribers,
          });
        });

        // On every Stream destroyed...
        mySession.on("streamDestroyed", (event) => {
          // Remove the stream from 'subscribers' array
          this.deleteSubscriber(event.stream.streamManager);
        });

        // On every asynchronous exception...
        mySession.on("exception", (exception) => {
          console.warn(exception);
        });

        //이부분 추가 publisherStartSpeaking, publisherStopSpeaking 이부분
        // 발언자 감지
        // mySession.on("publisherStartSpeaking", (event) => {
        //   for (let i = 0; i < this.userRef.current.children.length; i++) {
        //     if (
        //       JSON.parse(event.connection.data).clientData ===
        //       this.userRef.current.children[i].innerText
        //     ) {
        //       this.userRef.current.children[i].style.borderStyle = "solid";
        //       this.userRef.current.children[i].style.borderColor = "#1773EA";
        //     }
        //   }
        //   console.log(
        //     "User " + event.connection.connectionId + " start speaking"
        //   );
        // });

        // mySession.on("publisherStopSpeaking", (event) => {
        //   console.log(
        //     "User " + event.connection.connectionId + " stop speaking"
        //   );
        //   for (let i = 0; i < this.userRef.current.children.length; i++) {
        //     if (
        //       JSON.parse(event.connection.data).clientData ===
        //       this.userRef.current.children[i].innerText
        //     ) {
        //       this.userRef.current.children[i].style.borderStyle = "none";
        //     }
        //   }
        // });

        // --- 4) Connect to the session with a valid user token ---

        // Get a token from the OpenVidu deployment
        this.getToken().then((token) => {
          // First param is the token got from the OpenVidu deployment. Second param can be retrieved by every user on event
          // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
          // console.log(token);
          mySession
            .connect(token, { clientData: this.state.myUserName })
            .then(async () => {
              // --- 5) Get your own camera stream ---

              // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
              // element: we will manage it on our own) and with the desired properties
              let publisher = await this.OV.initPublisherAsync(undefined, {
                audioSource: undefined, // The source of audio. If undefined default microphone
                videoSource: undefined, // The source of video. If undefined default webcam
                publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
                publishVideo: true, // Whether you want to start publishing with your video enabled or not
                resolution: "320x240", // The resolution of your video
                frameRate: 30, // The frame rate of your video
                insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
                //이부분 수정 false->"false"로 변경
                mirror: "false", // Whether to mirror your local video or not
              });

              // --- 6) Publish your stream ---

              mySession.publish(publisher);

              // Obtain the current video device in use
              var devices = await this.OV.getDevices();
              var videoDevices = devices.filter(
                (device) => device.kind === "videoinput"
              );
              var currentVideoDeviceId = publisher.stream
                .getMediaStream()
                .getVideoTracks()[0]
                .getSettings().deviceId;
              var currentVideoDevice = videoDevices.find(
                (device) => device.deviceId === currentVideoDeviceId
              );

              // Set the main video in the page to display our webcam and store our Publisher
              this.setState({
                currentVideoDevice: currentVideoDevice,
                mainStreamManager: publisher,
                publisher: publisher,
              });
            })
            .catch((error) => {
              console.log(
                "There was an error connecting to the session:",
                // error.code,
                error
              );
            });
        });
      }
    );
  }

  leaveSession(dm_id) {
    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---

    api
      .post("/chat/session/leave", { id: dm_id })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => console.log(err));
    const mySession = this.state.session;

    if (mySession) {
      mySession.disconnect();
    }

    // Empty all properties...
    this.OV = null;
    this.setState({
      session: undefined,
      subscribers: [],
      // mySessionId: "Waffle",
      // myUserName: "유저네임",
      mySessionId: undefined,
      myUserName: undefined,
      mainStreamManager: undefined,
      publisher: undefined,
    });
  }

  switchAudio() {
    this.isMike = false;
  }

  async switchCamera() {
    try {
      const devices = await this.OV.getDevices();
      var videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      if (videoDevices && videoDevices.length > 1) {
        var newVideoDevice = videoDevices.filter(
          (device) => device.deviceId !== this.state.currentVideoDevice.deviceId
        );

        if (newVideoDevice.length > 0) {
          // Creating a new publisher with specific videoSource
          // In mobile devices the default and first camera is the front one
          var newPublisher = this.OV.initPublisher(undefined, {
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: true,
          });

          //newPublisher.once("accessAllowed", () => {
          await this.state.session.unpublish(this.state.mainStreamManager);

          await this.state.session.publish(newPublisher);
          this.setState({
            currentVideoDevice: newVideoDevice[0],
            mainStreamManager: newPublisher,
            publisher: newPublisher,
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    const { dm_id } = this.props.params;
    const mySessionId = this.state.mySessionId;
    const myUserName = this.state.myUserName;

    return (
      <div className="container">
        {this.state.session === undefined ? (
          <div
            id="join"
            style={{
              justifyContent: "center",
              textAlign: "center",
              alignItems: "center",
            }}
          >
            <div id="img-div"></div>
            <div id="join-dialog" className="jumbotron vertical-center">
              <h1> "채팅방 이름" in Waffle </h1>
              <form className="form-group" onSubmit={this.joinSession}>
                <p>
                  <label>참가자 이름: </label>
                  <input
                    className="form-control"
                    type="text"
                    id="userName"
                    value={myUserName}
                    onChange={this.handleChangeUserName}
                    required
                  />
                </p>
                <p>
                  <label> 화상회의실 이름: </label>
                  <InputTextInModal
                    className="form-control"
                    type="text"
                    id="sessionId"
                    value={mySessionId}
                    onChange={this.handleChangeSessionId}
                    required
                  />
                </p>
                <p className="text-center">
                  <BtnInModal
                    style={{ width: 200 }}
                    className="btn btn-lg btn-success"
                    name="commit"
                    type="submit"
                    value="JOIN"
                  />
                </p>
              </form>
            </div>
          </div>
        ) : null}

        {this.state.session !== undefined ? (
          <div id="session">
            <div id="session-header">
              <h1 id="session-title">{mySessionId}</h1>
              <ButtonInModal
                className="btn btn-large btn-danger"
                style={{ width: 200 }}
                type="button"
                id="buttonLeaveSession"
                onClick={this.leaveSession}
                value="Leave session"
              />
              {/* <ButtonInModal
                className="btn btn-large btn-success"
                style={{ width: 200 }}
                type="button"
                id="buttonSwitchCamera"
                onClick={this.switchCamera}
                value="Switch Camera"
              /> */}
              {this.isCamera ? (
                <BsCameraVideoFill
                  className="btn btn-large btn-success"
                  style={{ width: 200, fontSize: 30 }}
                  type="button"
                  id="buttonSwitchCamera"
                  onClick={this.switchCamera}
                  value="Switch Camera"
                />
              ) : (
                <BsCameraVideoOffFill
                  className="btn btn-large btn-success"
                  style={{ width: 200, fontSize: 30 }}
                  type="button"
                  id="buttonSwitchCamera"
                  onClick={this.switchCamera}
                  value="Switch Camera"
                />
              )}
              {/* <ButtonInModal
                className="btn btn-large btn-success"
                style={{ width: 200 }}
                type="button"
                id="buttonSwitchMic"
                //여기변경
                onClick={(this.isMike = false)}
                value="Switch Mic"
              /> */}
              {this.isMike ? (
                <BsFillMicFill
                  className="btn btn-large btn-success"
                  style={{ width: 200 }}
                  type="button"
                  id="buttonSwitchMic"
                  //여기변경
                  onClick={this.switchAudio}
                  value="Switch Mic"
                />
              ) : (
                <BsFillMicMuteFill
                  className="btn btn-large btn-success"
                  style={{ width: 200 }}
                  type="button"
                  id="buttonSwitchMic"
                  //여기변경
                  onClick={this.switchAudio}
                  value="Switch Mic"
                />
              )}
            </div>

            {/* {this.state.mainStreamManager !== undefined ? (
              <div id="main-video" className="col-md-6">
                <UserVideoComponent
                  streamManager={this.state.mainStreamManager}
                />
              </div>
            ) : null} */}
            <div id="video-container" className="col-md-6">
              {/* {this.state.publisher !== undefined ? (
                <div
                  className="stream-container col-md-6 col-xs-6"
                  style={{ padding: 0 }}
                  onClick={() =>
                    this.handleMainVideoStream(this.state.publisher)
                  }
                >
                  <UserVideoComponent streamManager={this.state.publisher} />
                </div>
              ) : null} */}
              {this.state.subscribers.map((sub, i) => (
                <div
                  key={i + JSON.parse(sub.stream.connection.data).clientData}
                  className="stream-container col-md-6 col-xs-6"
                  onClick={() => this.handleMainVideoStream(sub)}
                >
                  <span>{sub.id}</span>
                  <UserVideoComponent streamManager={sub} />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  /**
   * --------------------------------------------
   * GETTING A TOKEN FROM YOUR APPLICATION SERVER
   * --------------------------------------------
   * The methods below request the creation of a Session and a Token to
   * your application server. This keeps your OpenVidu deployment secure.
   *
   * In this sample code, there is no user control at all. Anybody could
   * access your application server endpoints! In a real production
   * environment, your application server must identify the user to allow
   * access to the endpoints.
   *
   * Visit https://docs.openvidu.io/en/stable/application-server to learn
   * more about the integration of OpenVidu in your application server.
   */
  async getToken() {
    const sessionId = await this.createSession(this.state.mySessionId);
    return await this.createToken(sessionId);
  }

  async createSession(sessionId) {
    const { dm_id } = this.props.params;
    console.log("세션 생성 함수");
    const response = await api.post(
      "/chat/session",
      { session_name: sessionId, id: dm_id },
      {}
    );
    this.response_session_id = response.data;
    // .then((res) => {
    //   console.log(res);
    //   this.response_session_id = res.data;
    // })
    // .catch((err) => console.log(err));
    console.log(response);
    return response.data; // The sessionId
  }

  async createToken(sessionId) {
    console.log("토큰 생성 함수");
    //여기서 url로 넘겨주는 sessionId는 서버에서 response로 받은 값(문자열)이어야 함
    const response = await api.post(
      `chat/session/${this.response_session_id}/connect`,
      {},
      {}
    );
    // .then((res) => {
    //   console.log(res);
    //   // this.
    // })
    // .catch((err) => console.log(err));
    console.log(response);
    return response.data; // The token
  }
}

export default withParams(VideoPage);
