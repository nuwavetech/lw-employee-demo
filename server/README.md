##Employee Server

The Employee Server is a standard Pathway server written in 'C'. To build the server, perform these steps, in order:

Transfer the files in this directory to a subvolume on your NonStop system. These are text files, so use "ascii" transfer mode. The remainder of the steps should be performed from TACL in the same subvolume.

1. RUN MAKEDB
  * This creates a DDL dictionary in the current subvolume, loads EMPDDL, and generates EMPH ('C' include file) and EMPFUP (FUP commands). It then creates the Enscribe data file, EMPDATA.
  
2. RUN MAKESVR
  * This compiles the server from the supplied EMPSVRC and EMPH generated above.
  
3. RUN STARTUP
  * This starts a Pathmon, $NWEMP, and configures the EMPSVR program as serverclass EMPLOYEE-SERVER. 
  
4. Add the following DEFINE to your LightWave Server startup and restart LightWave:

   ADD DEFINE =EMPLOYEE-PATHMON, CLASS MAP, FILE $NWEMP
  
  
If you have not already, complete the steps in the LightWave and client folders.
