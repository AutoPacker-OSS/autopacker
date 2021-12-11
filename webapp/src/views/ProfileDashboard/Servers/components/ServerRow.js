import { Avatar, Card, Typography } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { PlayCircleOutlined } from '@ant-design/icons';

function ServerRow(props) {
  // Import sub components from antd
  const { Text, Paragraph } = Typography;

  const dispatch = useDispatch();

  let statusIcon = { type: 'play-circle', color: 'green' };
  let actions = '';
  /* switch (props.status) {
		case "on":
			statusIcon = { type: "play-circle", color: "green" };
			actions = (
				<p>
					Actions: <span style={{ color: "blue" }}>Stop - Restart</span>
				</p>
			);
			break;

		case "off":
			statusIcon = { type: "poweroff", color: "red" };
			actions = (
				<p>
					Actions: <span style={{ color: "blue" }}>Start</span>
				</p>
			);
			break;

		case "restart":
			statusIcon = { type: "redo", color: "blue" };
			actions = (
				<p>
					Actions: <span style={{ color: "blue" }}>Stop - Restart</span>
				</p>
			);
			break;

		default:
			statusIcon = { type: "exclamation-circle", color: "#fcd700" };
			actions = "Actions: Unavailable";
			break;
	} */

  return (
    <Link to={'/profile/servers/overview/' + props.title}>
      <Card
        className="server-card"
        hoverable
        style={{ maxHeight: 100, height: 'auto', marginTop: -10 }}
        onClick={() => sessionStorage.setItem('selectedServer', props.id)}>
        <Avatar
          icon={<PlayCircleOutlined style={{ color: statusIcon.color }} />}
          style={{
            marginTop: -25,
            marginLeft: -20,
            height: 86,
            background: 'none',
            float: 'left',
            verticalAlign: 'middle',
          }}
          size={96}
        />
        <div style={{ marginTop: -3 }}>
          <Text strong style={{ fontSize: 20 }}>
            {props.title}
          </Text>
          <Text style={{ marginLeft: 20, fontSize: 20 }}>(Status: Unavailable{/*TODO props.status*/})</Text>
          <Paragraph ellipsis>{props.desc}</Paragraph>
          <Paragraph>{actions}</Paragraph>
        </div>
      </Card>
    </Link>
  );
}

export default ServerRow;
