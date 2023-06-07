// import React, { Component } from "react";
// import { useParams } from "react-router-dom";
// import OpenViduSession from "openvidu-react";

// import { api } from "../../api/Interceptors";

// function withParams(Component) {
//   return (props) => <Component {...props} params={useParams()} />;
// }

// class VideoPage2 extends Component {
//   constructor(props) {
//     super(props);

//     //첫 화면에서 이렇게 하는데 우리는 첫 화면이 따로 없으므로 필요 없음
//     this.state = {
//       mySessionId: "SessionA",
//       myUserName: "OpenVidu_User_" + Math.floor(Math.random() * 100),
//       token: undefined,
//       response_session_id: "",
//     };

//     this.handlerJoinSessionEvent = this.handlerJoinSessionEvent.bind(this);
//     this.handlerLeaveSessionEvent = this.handlerLeaveSessionEvent.bind(this);
//     this.handlerErrorEvent = this.handlerErrorEvent.bind(this);
//     this.handleChangeSessionId = this.handleChangeSessionId.bind(this);
//     this.handleChangeUserName = this.handleChangeUserName.bind(this);
//     this.joinSession = this.joinSession.bind(this);
//   }

//   //세션 참여시 발생하는 이벤트(우리가 맘대로 바꾸면 됨)
//   handlerJoinSessionEvent() {
//     console.log("Join session");
//   }

//   //세션 나갈경우 발생하는 이벤트(우리가 맘대로 바꾸면 됨)
//   handlerLeaveSessionEvent() {
//     console.log("Leave session");
//     this.setState({
//       session: undefined,
//     });
//   }

//   //세션 오류 발생시 발생하는 이벤트(바꾸도록)
//   handlerErrorEvent() {
//     console.log("Session error");
//   }

//   //방 이름 - 우리는 그냥 채팅방 이름으로 설정하면 됨
//   handleChangeSessionId(e) {
//     this.setState({
//       mySessionId: e.target.value,
//     });
//   }

//   //username 변경 - 우리는 그냥 사용자 이름으로 하면 됨
//   handleChangeUserName(e) {
//     this.setState({
//       myUserName: e.target.value,
//     });
//   }

//   //화상챗 참여
//   //폼에서 트리거된 메서드 joinSession()은 세션을 초기화하고 해당 세션에 대한 토큰을 가져오는 역할을 담당합니다.
//   async joinSession(event) {
//     event.preventDefault();
//     if (this.state.mySessionId && this.state.myUserName) {
//       const token = await this.getToken();
//       //세션에 참여한 상태로 바꿔줌
//       this.setState({
//         token: token,
//         session: true,
//       });
//     }
//   }

//   render() {
//     const mySessionId = this.state.mySessionId;
//     const myUserName = this.state.myUserName;
//     const token = this.state.token;

//     return (
//       <div>
//         {this.state.session === undefined ? (
//           //첫 방 들어가는 화면(우리는 없어도 됨) - 통화 버튼 누르면 참여자 이름, 방 이름 지정하도록 하면 될듯
//           <div id="join">
//             <div id="join-dialog">
//               <h1> Join a video session </h1>
//               <form onSubmit={this.joinSession}>
//                 <p>
//                   {/* //참여자 */}
//                   <label>Participant: </label>
//                   <input
//                     type="text"
//                     id="userName"
//                     value={myUserName} //참여자 이름 지정
//                     onChange={this.handleChangeUserName}
//                     required
//                   />
//                 </p>

//                 <p>
//                   <label> Session: </label>
//                   <input
//                     type="text"
//                     id="sessionId"
//                     value={mySessionId} //방 이름 지정
//                     onChange={this.handleChangeSessionId}
//                     required
//                   />
//                 </p>

//                 <p>
//                   <input name="commit" type="submit" value="JOIN" />
//                 </p>
//               </form>
//             </div>
//           </div>
//         ) : (
//           //참여
//           <div id="session">
//             <OpenViduSession
//               id="opv-session"
//               sessionName={mySessionId}
//               user={myUserName}
//               token={token}
//               joinSession={this.handlerJoinSessionEvent}
//               leaveSession={this.handlerLeaveSessionEvent}
//               error={this.handlerErrorEvent}
//             />
//           </div>
//         )}
//       </div>
//     );
//   }
//   //token은 openvidu session에 참여하기 위해 필요
//   async getToken() {
//     const sessionId = await this.createSession(this.state.mySessionId);
//     return await this.createToken(sessionId);
//   }

//   //session 연결하도록 server에 정보 넘겨주기
//   async createSession(sessionId) {
//     const response = await api.post(
//       "/chat/session",
//       { session_name: sessionId },
//       {}
//     );
//     this.response_session_id = response.data;
//     return response.data; // The sessionId
//   }

//   //session에 사용자 연결
//   async createToken(sessionId) {
//     const response = await api.post(
//       `chat/session/${this.response_session_id}/connect`,
//       {},
//       {}
//     );
//     return response.data; // The token
//   }
// }

// export default withParams(VideoPage2);
